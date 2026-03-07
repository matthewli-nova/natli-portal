import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { OverviewTab } from "./OverviewTab";
import { SalesTab } from "./SalesTab";
import { PaymentTab } from "./PaymentTab";
import { ProductTab } from "./ProductTab";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex-1 space-y-4 min-w-0 w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4 w-full min-w-0">
          <OverviewTab key="overview" />
        </TabsContent>
        <TabsContent value="sales" className="space-y-4 w-full min-w-0">
          {activeTab === "sales" && <SalesTab key="sales" />}
        </TabsContent>
        <TabsContent value="payment" className="space-y-4 w-full min-w-0">
          {activeTab === "payment" && <PaymentTab key="payment" />}
        </TabsContent>
        <TabsContent value="products" className="space-y-4 w-full min-w-0">
          {activeTab === "products" && <ProductTab key="products" />}
        </TabsContent>
      </Tabs>
    </div>
  );
}