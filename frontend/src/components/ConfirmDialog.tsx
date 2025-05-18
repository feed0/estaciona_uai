interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2">
            No
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
}