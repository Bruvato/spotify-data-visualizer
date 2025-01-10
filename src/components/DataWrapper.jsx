export default function DataWrapper({
    children,
    data,
    dataTitle,
    dataSubtitle,
}) {
    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <h2 className="text-4xl font-bold">{dataTitle}</h2>

                <p className="">{dataSubtitle}</p>
            </div>

            {!data || data.length == 0 ? (
                <h1 className="font-bold text-xl">Not Enough Data...</h1>
            ) : (
                children
            )}
        </div>
    );
}
