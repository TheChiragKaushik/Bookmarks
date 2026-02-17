import { FC, MouseEventHandler } from "react"

type LoginProps = {
    loginWithGoogle: MouseEventHandler<HTMLButtonElement>
}

const Login: FC<LoginProps> = ({ loginWithGoogle }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-200 px-4"> <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">

            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-800">
                    BookmarkHub
                </h1>
                <p className="text-slate-500 text-sm">
                    Save, organize, and access your links anywhere.
                </p>
            </div>

            <div className="text-sm text-slate-600 space-y-1">
                <p>• One place for all your bookmarks</p>
                <p>• Access across devices</p>
                <p>• Fast search & organization</p>
            </div>

            <button
                onClick={loginWithGoogle}
                className="cursor-pointer w-full flex items-center justify-center gap-3 border border-slate-300 rounded-lg py-3 font-medium text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="w-5 h-5"
                >
                    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z" />
                    <path fill="#4CAF50" d="M24 44c5.1 0 9.8-2 13.3-5.3l-6.1-5c-2 1.4-4.5 2.3-7.2 2.3-5.2 0-9.6-3.3-11.1-8l-6.5 5C9.7 39.6 16.3 44 24 44z" />
                    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.9-3 5.3-5.9 6.9l6.1 5C39.5 36.2 44 30.6 44 24c0-1.3-.1-2.3-.4-3.5z" />
                </svg>

                Continue with Google
            </button>

            <p className="text-xs text-slate-400">
                Your data stays private and secure.
            </p>
        </div>
        </div>
    )


}

export default Login
