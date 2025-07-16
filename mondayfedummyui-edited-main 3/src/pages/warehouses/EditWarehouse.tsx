import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {
  useFetchWarehouse,
  useUpdateWarehouse,
} from "../../hooks/useWarehouses";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WarehouseFormData,
  warehouseSchema,
} from "../../schemas/warehouseSchema";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "../../types/types";
import UserProfileCard from "../../components/UserProfileCard";

const EditWarehouse = () => {
  const { id } = useParams<{ id: string }>();
  const { data: warehouse, isPending: isWarehouseLoading } = useFetchWarehouse(
    Number(id)
  );
  const { mutate: updateWarehouse, isPending: isUpdating } =
    useUpdateWarehouse();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState(
    "/assets/images/icons/gallery-grey.svg"
  );

  // ✅ React Hook Form Setup
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
  });

  // ✅ Populate form fields when warehouse data is available
  useEffect(() => {
    if (warehouse) {
      setValue("name", warehouse.name);
      setValue("phone", warehouse.phone);
      setValue("address", warehouse.address);
      if (warehouse.photo) {
        setImagePreview(warehouse.photo);  
      }
    }
  }, [warehouse, setValue]);

  const onSubmit = (data: WarehouseFormData) => {
    updateWarehouse(
      { id: Number(id), ...data },
      {
        onError: (error: AxiosError<ApiErrorResponse>) => {
          const { message, errors: fieldErrors } = error.response?.data || {};
          if (message) {
            setError("root", { type: "server", message });
          }
          if (fieldErrors) {
            Object.entries(fieldErrors).forEach(([key, value]) => {
              setError(key as keyof WarehouseFormData, {
                type: "server",
                message: value[0],
              });
            });
          }
        },
      }
    );
  };

  if (isWarehouseLoading) return <p>Loading warehouse details...</p>;

  return (
    <div id="main-container" className="flex flex-1">
      <Sidebar />
      <div id="Content" className="flex flex-col flex-1 p-6 pt-0">
        <div
          id="Top-Bar"
          className="flex items-center w-full gap-6 mt-[30px] mb-6"
        >
          <div className="flex items-center gap-6 h-[92px] bg-white w-full rounded-3xl p-[18px]">
            <div className="flex flex-col gap-[6px] w-full">
              <h1 className="font-bold text-2xl">Edit Warehouse</h1>
              <Link
                to={"/warehouses"}
                className="flex items-center gap-[6px] text-monday-gray font-semibold"
              >
                <img
                  src="/assets/images/icons/arrow-left-grey.svg"
                  className="size-4 flex shrink-0"
                  alt="icon"
                />
                Manage Warehouses
              </Link>
            </div>
            <div className="flex items-center flex-nowrap gap-3">
              <a href="#">
                <div className="flex size-14 rounded-full bg-monday-gray-background items-center justify-center overflow-hidden">
                  <img
                    src="/assets/images/icons/search-normal-black.svg"
                    className="size-6"
                    alt="icon"
                  />
                </div>
              </a>
              <a href="#">
                <div className="flex size-14 rounded-full bg-monday-gray-background items-center justify-center overflow-hidden">
                  <img
                    src="/assets/images/icons/notification-black.svg"
                    className="size-6"
                    alt="icon"
                  />
                </div>
              </a>
              <div className="relative w-fit">
                <div className="flex size-14 rounded-full bg-monday-lime-green items-center justify-center overflow-hidden">
                  <img
                    src="/assets/images/icons/crown-black-fill.svg"
                    className="size-6"
                    alt="icon"
                  />
                </div>
                <p className="absolute transform -translate-x-1/2 left-1/2 -bottom-2 rounded-[20px] py-1 px-2 bg-monday-black text-white w-fit font-extrabold text-[8px]">
                  PRO
                </p>
              </div>
            </div>
          </div>
          <UserProfileCard />
        </div>
        <main className="flex flex-col gap-6 flex-1">
          <div className="flex gap-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col w-full rounded-3xl p-[18px] gap-5 bg-white"
            >
              <h2 className="font-semibold text-xl capitalize">
                Complete the form
              </h2>
              <div className="flex items-center justify-between w-full">
                <div className="group relative flex size-[100px] rounded-2xl overflow-hidden items-center justify-center bg-monday-background">
                  <img
                    id="Thumbnail"
                    src={imagePreview}
                    className="size-full object-cover"
                    alt="icon"
                  />
                  <input
                    type="file"
                    id="File-Input"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setValue("photo", file); // ✅ update react-hook-form
                        setImagePreview(URL.createObjectURL(file)); // ✅ update preview
                      } else {
                        setImagePreview(
                          "/assets/images/icons/gallery-grey.svg"
                        ); // fallback
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-black w-[152px] font-semibold text-nowrap"
                >
                  {imagePreview !== "/assets/images/icons/gallery-grey.svg"
                    ? "Change Photo"
                    : "Add Photo"}
                </button>
              </div>
              {errors.photo && (
                <p className="text-red-500">{errors.photo.message}</p>
              )}

              <label className="group relative">
                <div className="flex items-center pr-4 absolute transform -translate-y-1/2 top-1/2 left-6 border-r-[1.5px] border-monday-border ">
                  <img
                    src="/assets/images/icons/buildings-2-grey.svg"
                    className="flex size-6 shrink-0"
                    alt="icon"
                  />
                </div>
                <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:placeholder-shown]:top-[36px] group-focus-within:top-[25px] transition-300">
                  Warehouse Name
                </p>
                <input
                  type="text"
                  {...register("name")}
                  className="appearance-none w-full h-[72px] font-semibold text-lg rounded-3xl border-[1.5px] border-monday-border pl-20 pr-6 pb-[14.5px] pt-[34.5px] placeholder-shown:pt-[14.5px] focus:border-monday-black transition-300"
                  placeholder=""
                />
              </label>
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}

              <label className="group relative">
                <div className="flex items-center pr-4 absolute transform -translate-y-1/2 top-1/2 left-6 border-r-[1.5px] border-monday-border ">
                  <img
                    src="/assets/images/icons/call-grey.svg"
                    className="flex size-6 shrink-0"
                    alt="icon"
                  />
                </div>
                <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:placeholder-shown]:top-[36px] group-focus-within:top-[25px] transition-300">
                  Phone Number
                </p>
                <input
                  type="text"
                  {...register("phone")}
                  className="appearance-none w-full h-[72px] font-semibold text-lg rounded-3xl border-[1.5px] border-monday-border pl-20 pr-6 pb-[14.5px] pt-[34.5px] placeholder-shown:pt-[14.5px] focus:border-monday-black transition-300"
                  placeholder=""
                />
              </label>
              {errors.phone && (
                <p className="text-red-500">{errors.phone.message}</p>
              )}

              <label className="flex py-4 px-6 rounded-3xl border-[1.5px] border-monday-border focus-within:border-monday-black transition-300">
                <div className="flex h-full pr-4 pt-2 border-r-[1.5px] border-monday-border ">
                  <img
                    src="/assets/images/icons/location-grey.svg"
                    className="flex size-6 shrink-0"
                    alt="icon"
                  />
                </div>
                <div className="flex flex-col gap-[6px] pl-4 w-full">
                  <p className="placeholder font-medium text-monday-gray text-sm">
                    Warehouse Address
                  </p>
                  <textarea
                    {...register("address")}
                    className="appearance-none outline-none w-full font-semibold text-lg leading-[160%]"
                    rows={5}
                    placeholder=""
                    defaultValue={""}
                  />
                </div>
              </label>
              {errors.address && (
                <p className="text-red-500">{errors.address.message}</p>
              )}

              <div className="flex items-center justify-end gap-4">
                <Link to={'/warehouses'}
                  className="btn btn-red font-semibold"
                >
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary font-semibold">
                  {isUpdating ? "Updating..." : "Update Warehouse"}
                </button>
              </div>
            </form>
            <div className="flex flex-col w-[392px] shrink-0 h-fit rounded-3xl p-[18px] gap-3 bg-white">
              <p className="font-semibold">Quick Guide to Add New Warehouse</p>
              <ul className="flex flex-col gap-4">
                <li className="flex gap-[6px]">
                  <img
                    src="/assets/images/icons/Checklist-green-circle.svg"
                    className="flex size-6 shrink-0"
                    alt="icon"
                  />
                  <p className="font-medium leading-[140%]">
                    Enter a Clear and Descriptive Warehouse Name Lorem Ipsum
                    Color Mix Amet
                  </p>
                </li>
                <li className="flex gap-[6px]">
                  <img
                    src="/assets/images/icons/Checklist-green-circle.svg"
                    className="flex size-6 shrink-0"
                    alt="icon"
                  />
                  <p className="font-medium leading-[140%]">
                    Provide a Valid Phone Number for Contact Lorem Ipsum is text
                    simply
                  </p>
                </li>
                <li className="flex gap-[6px]">
                  <img
                    src="/assets/images/icons/Checklist-green-circle.svg"
                    className="flex size-6 shrink-0"
                    alt="icon"
                  />
                  <p className="font-medium leading-[140%]">
                    Accurately Input the Complete Lorem Warehouse Address Lorem
                    Ipsum
                  </p>
                </li>
                <li className="flex gap-[6px]">
                  <img
                    src="/assets/images/icons/Checklist-green-circle.svg"
                    className="flex size-6 shrink-0"
                    alt="icon"
                  />
                  <p className="font-medium leading-[140%]">
                    Upload an Appropriate Warehouse Image Dummy Lorem Ipsum
                  </p>
                </li>
                <li className="flex gap-[6px]">
                  <img
                    src="/assets/images/icons/Checklist-green-circle.svg"
                    className="flex size-6 shrink-0"
                    alt="icon"
                  />
                  <p className="font-medium leading-[140%]">
                    Save and Verify the Warehouse Ipsum Information text simply
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditWarehouse;
