import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { deleteGrant } from "../store/grantSlice";
import { useBatchStockQuotes } from "../api/alphaVantage";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Plus, Building2, RefreshCw } from "lucide-react";
import GrantCard from "../components/GrantCard";
import { useNavigate } from "react-router-dom";
import { FrameMotionWrapper } from "@/components/framer-motion";

const AllGrantsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const grants = useSelector((state: RootState) => state.grants.grants);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  const symbols = [...new Set(grants.map((g) => g.symbol))];
  const { isLoading, refetch, isRefetching } = useBatchStockQuotes(symbols);

  const handleDelete = (grantId: string) => {
    dispatch(deleteGrant(grantId));
    setShowDeleteConfirm(null);
  };

  return (
    <FrameMotionWrapper key="allGrant">
      <div className="flex justify-center w-full min-h-screen p-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold ">All Grants</h1>
            <div className="flex gap-2">
              <Button
                onClick={() => refetch()}
                variant="outline"
                size="sm"
                disabled={isLoading || isRefetching}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-1 ${
                    isRefetching ? "animate-spin" : ""
                  }`}
                />
                {isRefetching ? "Refreshing..." : "Refresh"}
              </Button>
              <Button onClick={() => navigate("/addEditGrantPage")} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {grants.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Building2 className="w-12 h-12  mx-auto mb-4" />
                <p className=" text-base mb-4">No grants found</p>
                <Button
                  onClick={() => navigate("/addEditGrantPage")}
                  className=""
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Grant
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {grants.map((grant) => (
                <GrantCard
                  key={grant.id}
                  grant={grant}
                  onEdit={() => navigate(`/addEditGrantPage?id=${grant.id}`)}
                  onDelete={() => setShowDeleteConfirm(grant.id)}
                  onViewDetails={() => navigate(`/grantDetails/${grant.id}`)}
                />
              ))}
            </div>
          )}

          {showDeleteConfirm && (
            <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-sm">
                <CardHeader>
                  <CardTitle>Confirm Delete</CardTitle>
                  <CardDescription>
                    Are you sure you want to delete this grant? This action
                    cannot be undone.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(showDeleteConfirm)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </FrameMotionWrapper>
  );
};

export default AllGrantsPage;
