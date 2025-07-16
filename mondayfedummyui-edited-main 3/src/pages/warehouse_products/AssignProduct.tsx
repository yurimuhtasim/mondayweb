import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetchWarehouse } from "../../hooks/useWarehouses";
import Sidebar from "../../components/Sidebar";
import { AxiosError } from "axios";
import { AssignWarehouseProductFormData, assignWarehouseProductSchema } from "../../schemas/assignWarehouseProductSchema";
import { useFetchProducts } from "../../hooks/useProducts";
import { useAssignWarehouseProduct } from "../../hooks/useWarehouseProducts";
import { ApiErrorResponse, AssignWarehouseProductPayload } from "../../types/types";
import UserProfileCard from "../../components/UserProfileCard";

const AssignWarehouseProduct = () => {
  const { id } = useParams<{ id: string }>(); // Get warehouse ID from URL

  const { data: warehouse, isPending: loadingWarehouse } = useFetchWarehouse(Number(id));
  const { data: products, isPending: loadingProducts } = useFetchProducts();
  const { mutate: assignProduct, isPending } = useAssignWarehouseProduct();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AssignWarehouseProductFormData>({
    resolver: zodResolver(assignWarehouseProductSchema),
  });

  const onSubmit = (data: AssignWarehouseProductFormData) => {

    // Reset previous errors before submitting
    setError("root", { type: "server", message: "" });

    const payload: AssignWarehouseProductPayload = {
      warehouse_id: Number(id),
      product_id: Number(data.product_id),
      stock: Number(data.stock),
    };
    
    assignProduct(payload, {
      onError: (error: AxiosError<ApiErrorResponse>) => {

        if (error.response) {
          const { message, errors } = error.response.data;
  
          // ✅ Show general API error message at the top
          if (message) {
            setError("root", { type: "server", message });
          }
  
          // ✅ Display field-specific errors if present
          if (errors) {
            Object.entries(errors).forEach(([key, messages]) => {
              setError(key as keyof AssignWarehouseProductFormData, { type: "server", message: messages[0] });
            });
          }
        } 
      },
    });
  }; 


  if (!warehouse) return <p>Not found...</p>;
  if (loadingWarehouse || loadingProducts) return <p>Loading...</p>;

  return (
    <div id="main-container" className="flex flex-1">
  <Sidebar/>
  <div id="Content" className="flex flex-col flex-1 p-6 pt-0">
    <div id="Top-Bar" className="flex items-center w-full gap-6 mt-[30px] mb-6">
      <div className="flex items-center gap-6 h-[92px] bg-white w-full rounded-3xl p-[18px]">
        <div className="flex flex-col gap-[6px] w-full">
          <h1 className="font-bold text-2xl">Assign New Product</h1>
          <Link to={`/warehouse-products/${id}`}
            className="flex items-center gap-[6px] text-monday-gray font-semibold"
          >
            <img
              src="/assets/images/icons/arrow-left-grey.svg"
              className="size-4 flex shrink-0"
              alt="icon"
            />
            Warehouse Details
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
      <UserProfileCard/>
    </div>
    <main className="flex flex-col gap-6 flex-1">
      <div className="flex gap-6">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col rounded-3xl p-[18px] gap-5 bg-white">
            <p className="font-semibold text-xl">Warehouse Details</p>
            <div className="flex items-center gap-3">
              <div className="flex size-16 rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                <img
                  src={warehouse.photo}
                  className="size-full object-cover"
                  alt="icon"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <p className="font-semibold text-lg">{warehouse.name}</p>
                <p className="flex items-center gap-1 font-medium text-lg text-monday-gray">
                  <img
                    src="/assets/images/icons/call-grey.svg"
                    className="size-6 flex shrink-0"
                    alt="icon"
                  />
                  <span>{warehouse.phone}</span>
                </p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full rounded-3xl p-[18px] gap-5 bg-white"
          >
            <h2 className="font-semibold text-xl capitalize">
              Complete the form
            </h2>
            {errors.root && (
              <p className="text-red-500 bg-red-100 border border-red-400 p-2 rounded">
                {errors.root.message}
              </p>
            )}
            <label className="group relative rounded-3xl border-[1.5px] border-monday-border focus-within:border-monday-black transition-300 overflow-hidden">
              <div className="flex items-center pr-4 absolute transform -translate-y-1/2 top-1/2 left-6 border-r-[1.5px] border-monday-border ">
                <img
                  src="/assets/images/icons/barcode-black.svg"
                  className="flex size-6 shrink-0"
                  alt="icon"
                />
              </div>
              <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:invalid]:top-[36px] group-focus-within:top-[25px] transition-300">
                Product ID
              </p>
              {loadingProducts ? (
                  <p>Loading products...</p>
                ) : (
                  <select
                    {...register("product_id")}
                    className="appearance-none w-full h-[72px] font-semibold text-lg outline-none pl-20 pr-6 pb-[14.5px] pt-[32px]"
                  >
                    {products?.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                )}
                {errors.product_id && (
                  <p className="text-red-500">{errors.product_id.message}</p>
                )} 
              <img
                src="/assets/images/icons/arrow-down-grey.svg"
                className="absolute transform -translate-y-1/2 top-1/2 right-6 size-6"
                alt="icon"
              />
            </label>
            <label className="group relative">
              <div className="flex items-center pr-4 absolute transform -translate-y-1/2 top-1/2 left-6 border-r-[1.5px] border-monday-border ">
                <img
                  src="/assets/images/icons/box-grey.svg"
                  className="flex size-6 shrink-0"
                  alt="icon"
                />
              </div>
              <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:placeholder-shown]:top-[36px] group-focus-within:top-[25px] transition-300">
                Type a Stock
              </p>
              <input
                type="number"
                {...register("stock", { valueAsNumber: true })}
                className="appearance-none w-full h-[72px] font-semibold text-lg rounded-3xl border-[1.5px] border-monday-border pl-20 pr-6 pb-[14.5px] pt-[34.5px] placeholder-shown:pt-[14.5px] focus:border-monday-black transition-300"
                placeholder=""
              />
            </label>
            {errors.stock && (
                  <p className="text-red-500">{errors.stock.message}</p>
                )} 
            <div className="flex items-center justify-end gap-4">
            <Link to={'/warehouse-products/${warehouse.id}'}
                className="btn btn-red font-semibold"
              >
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary font-semibold">
              {isPending ? "Saving..." : "Save data"}
              </button>
            </div>
          </form>
        </div>
        <div className="flex flex-col w-[392px] shrink-0 h-fit rounded-3xl p-[18px] gap-3 bg-white">
          <p className="font-semibold">Quick Guide to Assign New Product</p>
          <ul className="flex flex-col gap-4">
            <li className="flex gap-[6px]">
              <img
                src="/assets/images/icons/Checklist-green-circle.svg"
                className="flex size-6 shrink-0"
                alt="icon"
              />
              <p className="font-medium leading-[140%]">
                Make Sure the Warehouse Details Are Correct Lorem Ipsum is
                Simply Text
              </p>
            </li>
            <li className="flex gap-[6px]">
              <img
                src="/assets/images/icons/Checklist-green-circle.svg"
                className="flex size-6 shrink-0"
                alt="icon"
              />
              <p className="font-medium leading-[140%]">
                Enter the Product Details Correctly and Accurately Lorem Ipsum
                Color amet
              </p>
            </li>
            <li className="flex gap-[6px]">
              <img
                src="/assets/images/icons/Checklist-green-circle.svg"
                className="flex size-6 shrink-0"
                alt="icon"
              />
              <p className="font-medium leading-[140%]">
                Specify the Stock Quantity to Be Added Accurately is dummy text
              </p>
            </li>
            <li className="flex gap-[6px]">
              <img
                src="/assets/images/icons/Checklist-green-circle.svg"
                className="flex size-6 shrink-0"
                alt="icon"
              />
              <p className="font-medium leading-[140%]">
                Review the Entered Information for Accuracy Lorem Ipsum Dummy
              </p>
            </li>
            <li className="flex gap-[6px]">
              <img
                src="/assets/images/icons/Checklist-green-circle.svg"
                className="flex size-6 shrink-0"
                alt="icon"
              />
              <p className="font-medium leading-[140%]">
                Click "Create Now" to complete the process Lorem Ipsum{" "}
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

export default AssignWarehouseProduct;
