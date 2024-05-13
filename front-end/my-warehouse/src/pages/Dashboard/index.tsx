import { SquaresPlusIcon } from "@heroicons/react/24/outline";
import { ArchiveBoxIcon, PlusIcon } from "@heroicons/react/24/solid";
import EditUnit from "../../components/modal/EditUnit";
import Loading from "../../components/Loading";
import { useEffect, useState } from "react";
import Additem from "../../components/modal/AddItem";
import DeleteItem from "../../components/modal/DeleteItem";
import axios from "axios";
import { API } from "../../config";
import { NoImage } from "../../assets/images";
import UpdateToken from "../../config/UpdateToken";
import EditItem from "../../components/modal/EditItem";

type Items = {
  id: string;
  name: string;
  qty: number;
  description: string;
  location: string;
  picture: string;
  unit: string;
  created_at: Date;
  updated_at: Date;
};

const Dashboard = () => {
  const token = localStorage.getItem("access_token");
  // const controller = new AbortController();
  // const signal = controller.signal;
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Items[]>([]);
  const [selectedItem, setSelectedItem] = useState<string[]>([]);
  const [clickeditem, setClickedItem] = useState<Items | null>(null);
  const [openModalUnit, setOpenModalUnit] = useState(false);
  const [openModalUnit1, setOpenModalUnit1] = useState(false);
  const [openModalUnit2, setOpenModalUnit2] = useState(false);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const getItem = async () => {
    try {
      const id = localStorage.getItem("id_user");
      const response = await axios.get(`${API}/item/${id}`, { headers });
      console.log("resp getitem", response);
      const { status, data } = response.data;

      if (status === "success") {
        setItems(data.items);
      }
    } catch (error: any) {
      console.log("error getitem", error);
      if (error.response?.data.message === "jwt expired") {
        UpdateToken();
      }
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`${API}/item`, {
        headers,
        data: { id_items: selectedItem },
      });
      console.log("resp deleteItem", response);

      const { status } = response.data;

      if (status === "success") {
        setSelectedItem([]);
        getItem();
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      console.log("error deleteItem", error);
      if (error.response?.data.message === "jwt expired") {
        UpdateToken();
      }
    }
  };

  const toggleCheckbox = (id: string) => {
    const isSelected = selectedItem.includes(id);
    let newSelectedItems: string[];

    if (isSelected) {
      newSelectedItems = selectedItem.filter((itemId) => itemId !== id);
    } else {
      newSelectedItems = [...selectedItem, id];
    }

    setSelectedItem(newSelectedItems);
    console.log("sss", selectedItem);
  };

  useEffect(() => {
    getItem();
  }, []);

  useEffect(() => {
    console.log("ssc", clickeditem);
    if (clickeditem) {
      setOpenModalUnit2(true);
    }
  }, [clickeditem]);

  return (
    <div className="min-h-screen p-4">
      <Loading status={isLoading} />
      <h1 className="mb-8">DashBoard</h1>
      <div className="flex max-sm:flex-col max-sm:items-center gap-4">
        <div className="max-sm:w-screen overflow-x-hidden">
          <div className="mb-4 overflow-x-auto max-h-[65vh]">
            <table className="table table-zebra table-pin-rows">
              <thead className="text-secondary text-xl">
                <tr className="">
                  <th>
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          selectedItem.length === items.length &&
                          selectedItem.length > 0 &&
                          items.length > 0
                        }
                        onChange={() => {
                          if (selectedItem.length === items.length) {
                            setSelectedItem([]);
                          } else {
                            setSelectedItem(items?.map((item) => item.id));
                          }
                        }}
                        className="checkbox border-primary [--chkbg:theme(colors.primary)] [--chkfg:white]"
                      />
                    </label>
                  </th>
                  <th>Picture</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Location</th>
                  <th>Description</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              {items && items.length ? (
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      onDoubleClick={() => {
                        setClickedItem(item);
                      }}
                      className="hover:outline outline-primary cursor-pointer"
                    >
                      <th>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedItem.includes(item.id)}
                            onChange={() => toggleCheckbox(item.id)}
                            className="checkbox border-primary [--chkbg:theme(colors.primary)] [--chkfg:white]"
                          />
                        </label>
                      </th>
                      <td>
                        <div className="avatar">
                          <div className="mask mask-squircle w-14 h-14">
                            <img
                              src={item.picture ? item.picture : NoImage}
                              alt={`${item.name}`}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <p>{item.name}</p>
                      </td>
                      <td>{item.qty}</td>
                      <td>{item.location}</td>
                      <td>{item.description}</td>
                      <td>
                        {new Date(item.updated_at).toLocaleString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td className="text-center" colSpan={7}>
                      No items available
                    </td>
                  </tr>
                </tbody>
              )}
              <tfoot></tfoot>
            </table>
          </div>
          <DeleteItem
            isVisible={selectedItem.length > 0}
            qty={selectedItem.length}
            onConfirm={handleDelete}
          />
        </div>
        <div className="card h-fit max-w-80 min-w-72 bg-base-300 overflow-hidden shadow-xl">
          <div className="card-body p-0">
            <div className="card-title p-3 justify-between bg-primary text-white text-4xl">
              Total Item
              <ArchiveBoxIcon width={58} />
            </div>
            <div className="px-3 py-2 text-secondaryContent">
              <h3 className="font-semibold mb-1">Today</h3>
              <div className="flex justify-between">
                <div className="">
                  <p>Added</p>
                  <p>Removed</p>
                  <p>Edited</p>
                </div>
                <div className="">
                  <p className="">0</p>
                  <p className="">0</p>
                  <p className="">0</p>
                </div>
              </div>
            </div>
            <div className="rounded my-2 h-1 bg-secondaryContent"></div>
            <div className="flex flex-col text-center font-medium text-secondaryContent">
              <p className="text-4xl">{items.length}</p>
              <p className="text-xl">Items</p>
            </div>
            <div className="flex m-3 gap-3 [&_.btn]:outline-none">
              <div className="card-actions flex-1">
                <button
                  className="btn px-2 align-middle bg-warning hover:bg-slate-600 text-white"
                  onClick={() => setOpenModalUnit(true)}
                >
                  <PlusIcon width={20} />
                  Unit Type
                </button>
              </div>
              <div className="card-actions">
                <button
                  className="btn px-2 bg-secondary hover:bg-slate-600 text-white"
                  onClick={() => setOpenModalUnit1(true)}
                >
                  <SquaresPlusIcon className="w-10" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditUnit
        isVisible={openModalUnit}
        onClose={() => setOpenModalUnit(false)}
      />
      <Additem
        isVisible={openModalUnit1}
        onClose={() => setOpenModalUnit1(false)}
      />
      <EditItem
        isVisible={openModalUnit2}
        onClose={() => setOpenModalUnit2(false)}
        data={clickeditem}
      />
    </div>
  );
};

export default Dashboard;
