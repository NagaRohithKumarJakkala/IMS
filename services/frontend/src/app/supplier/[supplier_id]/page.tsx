"use client";
import SupplierEntryHistory from "@/components/supplier";
import TopBar from "@/components/topbar";
import { useParams } from "next/navigation";

const SupplierHistory = () => {
  const params = useParams();
  const supplierId = params?.supplier_id;
  return (
    <>
      {/* <TopBar /> */}
      <SupplierEntryHistory supplierId={supplierId} />
    </>
  );
};

export default SupplierHistory;
