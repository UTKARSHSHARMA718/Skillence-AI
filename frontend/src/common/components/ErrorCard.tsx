const ErrorCard = ({ message }: { message: string }) => {
  return (
    <div className="border border-red-500 bg-red-100 text-red-900 p-4 rounded max-w-md mx-auto font-sans text-center">
      <strong>Error:</strong>
      <div className="mt-2">{message}</div>
    </div>
  );
};

export default ErrorCard;
