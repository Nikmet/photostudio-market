interface Props {
    params: {
        id: string;
    };
}

export default function FramesEditPage({ params }: Props) {
    return (
        <div>
            <h1>Рамка - #{params.id}</h1>
        </div>
    );
}
