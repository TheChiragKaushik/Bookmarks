import React, { FC, useEffect, useState } from 'react'
import { Bookmark } from '../lib/interfaces';
import { fetchBookmarks, insertBookmark, removeBookmark, updateBookmark } from '../lib/bookmarksOperations';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

type BookmarksProps = {
    user: User | null
}

const Bookmarks: FC<BookmarksProps> = ({ user }) => {

    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editUrl, setEditUrl] = useState('');

    useEffect(() => {
        if (!user) return;

        let isMounted = true;

        const init = async () => {
            const data = await fetchBookmarks();
            if (isMounted) {
                setBookmarks(data);
                setLoading(false);
            }
        };


        init();

        const channel = supabase
            .channel('bookmarks-channel')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((prev) => [
                            payload.new as Bookmark,
                            ...prev
                        ]);
                    }

                    if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) =>
                            prev.filter((b) => b.id !== payload.old.id)
                        );
                    }

                    if (payload.eventType === 'UPDATE') {
                        setBookmarks((prev) =>
                            prev.map((b) =>
                                b.id === payload.new.id
                                    ? (payload.new as Bookmark)
                                    : b
                            )
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            isMounted = false;
            channel.unsubscribe();
        };
    }, [user]);

    async function addBookmark() {
        if (!title || !url || !user) return;

        const tempBookmark = {
            id: crypto.randomUUID(),
            title,
            url,
        };

        setBookmarks((prev) => [tempBookmark, ...prev]);

        setTitle("");
        setUrl("");

        await insertBookmark(title, url, user.id);
    }

    async function deleteBookmark(id: string) {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
        await removeBookmark(id);
    }

    function startEdit(bookmark: Bookmark) {
        setEditingId(bookmark.id);
        setEditTitle(bookmark.title);
        setEditUrl(bookmark.url);
    }

    async function handleUpdate(id: string) {
        if (!editTitle || !editUrl) return;

        setBookmarks((prev) =>
            prev.map((b) =>
                b.id === id ? { ...b, title: editTitle, url: editUrl } : b
            )
        );

        setEditingId(null);

        await updateBookmark(id, editTitle, editUrl, user!.id);

    }

    function cancelEdit() {
        setEditingId(null);
    }

    return (
        <div className="flex items-center justify-center flex-col md:flex-row gap-8 w-full p-4">

            <aside className="w-full md:w-105 shrink-0 self-start sticky top-4">

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                    <h2 className="text-lg font-bold text-slate-800 mb-2">New Bookmark</h2>

                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Website Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                        <input
                            type="url"
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                        <button
                            onClick={addBookmark}
                            disabled={!title || !url}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                        >
                            Add Bookmark
                        </button>
                    </div>
                </div>
            </aside>

            {/* List */}
            <main className="flex-1 space-y-4">
                {loading ? (
                    <div className="text-center py-20 text-slate-400">
                        Loading bookmarks...
                    </div>
                ) : bookmarks.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-xl text-slate-400">
                        No bookmarks yet. Start adding some!
                    </div>
                ) : (
                    bookmarks.map((b) => (
                        <div
                            key={b.id}
                            className="group bg-white border border-slate-200 p-4 rounded-xl flex justify-between items-center hover:border-blue-300 hover:shadow-md transition-all"
                        >
                            <div className="flex flex-col overflow-hidden mr-4 w-full">

                                {editingId === b.id ? (
                                    <>
                                        <input
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            className="border p-1 rounded mb-1"
                                        />
                                        <input
                                            value={editUrl}
                                            onChange={(e) => setEditUrl(e.target.value)}
                                            className="border p-1 rounded"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <span className="font-bold text-slate-800 truncate">
                                            {b.title}
                                        </span>
                                        <a
                                            href={b.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 text-sm truncate hover:underline"
                                        >
                                            {b.url}
                                        </a>
                                    </>
                                )}
                            </div>

                            <div className="flex gap-2">
                                {editingId === b.id ? (
                                    <>
                                        <button
                                            onClick={() => handleUpdate(b.id)}
                                            className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="bg-gray-300 px-2 py-1 rounded text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => startEdit(b)}
                                            className="opacity-0 group-hover:opacity-100 bg-yellow-50 text-yellow-600 p-2 rounded-lg hover:bg-yellow-500 hover:text-white transition-all text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteBookmark(b.id)}
                                            className="opacity-0 group-hover:opacity-100 bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
}

export default Bookmarks;
