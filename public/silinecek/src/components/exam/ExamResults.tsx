
type ExamResultsProps = {
    name: string;
};

export const ExamResults: React.FC<ExamResultsProps> = ({
                                                            name
                                                        }) => {


    return (
        <div className="mb-5">
            {name}
        </div>
    );
};
