import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

const DeleteItem: React.FC<{
  isVisible: boolean;
  qty: number;
  onConfirm: Function;
}> = ({ isVisible, qty, onConfirm }) => {
  return (
    isVisible && (
      <div className="flex rounded-full py-1 px-3 justify-between items-center bg-base-300">
        <h3>
          {qty} item{`${qty > 1 ? "s" : ""}`} selected
        </h3>
        <button className="btn btn-sm btn-ghost" onClick={() => onConfirm()}>
          <TrashIcon width={24} className="stroke-error" />
        </button>
      </div>
    )
  );
};

export default DeleteItem;
