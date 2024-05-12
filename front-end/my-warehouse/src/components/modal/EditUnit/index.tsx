import { TrashIcon } from "@heroicons/react/24/outline";
import Loading from "../../Loading";
import { useEffect, useState } from "react";
import Confirm from "../Confirm";
import { API } from "../../../config";
import axios from "axios";
import UpdateToken from "../../../config/UpdateToken";

type Unit = {
  id: string;
  id_user: string;
  name: string;
};

const EditUnit: React.FC<{
  isVisible: boolean;
  onClose: Function;
}> = ({ isVisible, onClose }) => {
  const token = localStorage.getItem("access_token");
  const id = localStorage.getItem("id_user");
  const [unitAdd, setUnitAdd] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("");

  const [unitList, setUnitList] = useState<Unit[]>([]);
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const getUnit = async () => {
    try {
      const response = await axios.get(`${API}/unit/${id}`, { headers });
      console.log("resp getUnit", response);
      const { status, data } = response.data;

      if (status === "success") {
        setUnitList(data.units);
      }
    } catch (error: any) {
      console.log("error submit", error);
      if (error.response?.data.message === "jwt expired") {
        UpdateToken();
      }
    }
  };

  const handleAddUnit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API}/unit/${id}`,
        { name: unitAdd },
        {
          headers,
        }
      );
      console.log("resp addUnit", response);
      const { status } = response.data;

      if (status === "success") {
        setUnitAdd("");
        getUnit();
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      console.log("error submit", error);
      if (error.response?.data.message === "jwt expired") {
        UpdateToken();
      }
    }
  };

  const handleDeleteUnit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`${API}/unit/${selectedUnit}`, {
        headers,
      });
      console.log("resp deleteUnit", response);
      const { status } = response.data;

      if (status === "success") {
        setSelectedUnit("");
        setIsConfirm(false);
        getUnit();
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      console.log("error submit", error);
      if (error.response?.data.message === "jwt expired") {
        UpdateToken();
      }
    }
  };

  // if (!isVisible) return null;
  useEffect(() => {
    getUnit();
    const handleCloseKey = (e: any) => {
      console.log("sdfsss");
      if (e.key === "Escape") {
        e.preventDefault();
        // setIsConfirm(false);
        // if (!isConfirm) {
        //   console.log("sssssssss");
        onClose();
        // }
      }
    };
    window.addEventListener("keydown", handleCloseKey);
    return () => window.removeEventListener("keydown", handleCloseKey);
  }, [!isConfirm]);

  return (
    isVisible && (
      <div
        // onKeyDown={handleCloseKey}
        className="flex fixed inset-0 z-10 bg-opacity-30 bg-slate-700 backdrop-blur-sm justify-center items-center"
      >
        <Loading status={isLoading} />
        <Confirm
          isVisible={isConfirm}
          onClose={() => setIsConfirm(false)}
          text="Are you sure wants to delete this item?"
          onConfirm={handleDeleteUnit}
        />
        <div className="flex flex-col gap-3 shadow rounded-lg min-w-[300px] max-h-[300px] p-3 bg-base-100 relative">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-error"
            onClick={() => onClose()}
          >
            ✕
          </button>
          <h3 className="font-bold text-secondary">Unit list</h3>
          <div className="max-h-32 my-4 overflow-y-scroll no-scrollbar">
            {unitList.map((item, index) => (
              <div
                className={`flex p-2 rounded-lg gap-4 items-center ${
                  index % 2 === 0 ? "bg-base-200" : ""
                }`}
                key={item.id}
              >
                <button
                  onClick={() => {
                    setSelectedUnit(item.id);
                    setIsConfirm(true);
                  }}
                >
                  <TrashIcon width={24} className="stroke-error" />
                </button>
                <p className={`text-center`}>{item.name}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type here"
              value={unitAdd}
              onChange={(e) => setUnitAdd(e.target.value)}
              className="input input-bordered focus:outline-primary focus:border-primary w-full"
            />
            <button
              className="btn bg-primary text-white"
              onClick={handleAddUnit}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default EditUnit;
