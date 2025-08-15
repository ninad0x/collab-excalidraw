"use client";

export function AuthPage({isSignin}: {
    isSignin: boolean
}) {
    return <div className="w-full h-screen flex justify-center items-center">
        <div className="modal p-5 m-2 bg-white rounded-2xl text-xl text-black">
            <input type="text" placeholder="email" />
            <input type="password" placeholder="password" />

            <button
                onClick={() => {

                }}
            >{isSignin ? "Sign in" : "Sign up"}

            </button>

        </div>
    </div>


}