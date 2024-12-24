export default function Button({ onClick }) {
    return (
        <button
            className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-full"
            onClick={onClick}
        >
            Log in
        </button>
    );
}
