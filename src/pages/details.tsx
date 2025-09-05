import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Building2, Check } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { calculateGrantMetrics } from "@/util/portfolio";
import dayjs from "dayjs";
import { FrameMotionWrapper } from "@/components/framer-motion";
import { useState } from "react";
import { deleteGrant } from "@/store/grantSlice";

const MobileGrantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const grant = useSelector((state: RootState) =>
    state.grants.grants.find((g) => g.id === id)
  );

  if (!grant) {
    return <div className="p-4 text-red-400">Grant not found</div>;
  }

  const metrics = calculateGrantMetrics(grant);

  let vestingSchedule: Array<{
    shares: number;
    date: string;
    vested: boolean;
  }> = [];

  if (grant.vestingSchedule === "custom" && grant.customVesting) {
    vestingSchedule = grant.customVesting.map((v) => ({
      shares: (grant.numberOfShares * v.percentageVested) / 100,
      date: dayjs(v.vestingDate).format("MMM DD, YYYY"),
      vested: dayjs(v.vestingDate).isBefore(dayjs()),
    }));
  } else {
    const yearlyShares = grant.numberOfShares / 4;
    const startDate = dayjs(grant.grantDate);
    vestingSchedule = [0, 1, 2, 3].map((i) => {
      const date = startDate.add(i + 1, "year");
      return {
        shares: yearlyShares,
        date: date.format("MMM DD, YYYY"),
        vested: date.isBefore(dayjs()),
      };
    });
  }

  const vestedShares = vestingSchedule
    .filter((v) => v.vested)
    .reduce((sum, v) => sum + v.shares, 0);

  const unvestedShares = grant.numberOfShares - vestedShares;
  const dispatch = useDispatch();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  const handleDelete = (grantId: string) => {
    dispatch(deleteGrant(grantId));
    setShowDeleteConfirm(null);
  };
  return (
    <FrameMotionWrapper key="detials">
      {showDeleteConfirm && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Confirm Delete</CardTitle>
              <CardDescription>
                Are you sure you want to delete this grant? This action cannot
                be undone.
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
      <div className="mobile-container">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Grant Details</h1>
          <div className="w-9" />
        </div>

        <Card className=" ">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{grant.company}</h2>
                <p className="">{grant.symbol}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-medium "></h3>
          <Card className=" ">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="">Grant Date</span>
                <span className="font-medium">
                  {dayjs(grant.grantDate).format("MMM DD, YYYY")}
                </span>
              </div>
              <div className="h-px bg-slate-700"></div>
              <div className="flex justify-between items-center py-2">
                <span className="">Total Shares</span>
                <span className="font-medium">{grant.numberOfShares}</span>
              </div>
              <div className="h-px bg-slate-700"></div>
              <div className="flex justify-between items-center py-2">
                <span className="">Grant Price</span>
                <span className="font-medium">${grant.grantPrice}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium ">Vesting Schedule</h3>
          <Card className=" ">
            <CardContent className="p-4">
              <div className="space-y-4">
                {vestingSchedule.map((vesting, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        vesting.vested ? "bg-blue-600" : "bg-slate-600"
                      }`}
                    >
                      {vesting.vested ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span
                          className={`font-medium ${vesting.vested ? "" : ""}`}
                        >
                          {vesting.shares} Shares{" "}
                          {vesting.vested ? "Vested" : ""}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">{vesting.date}</p>
                    </div>
                    {index < vestingSchedule.length - 1 && (
                      <div className="absolute left-8 mt-8 w-px h-4 bg-slate-600"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex-1 "
            onClick={() => navigate(`/addEditGrantPage?id=${grant.id}`)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => setShowDeleteConfirm(grant.id)}
          >
            Delete
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className=" ">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{vestedShares}</p>
              <p className="text-sm ">Vested Shares</p>
            </CardContent>
          </Card>
          <Card className=" ">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{unvestedShares}</p>
              <p className="text-sm ">Unvested Shares</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium ">Valuation</h3>
          <Card className=" ">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="">Current Value</span>
                <span className="text-2xl font-bold text-blue-400">
                  ${metrics.currentValue.toLocaleString()}
                </span>
              </div>
              <div className="h-px bg-slate-700"></div>
              <div className="flex justify-between items-center">
                <span className="">Estimated Net (After Tax)</span>
                <span className="text-xl font-semibold">
                  ${metrics.netProceeds.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FrameMotionWrapper>
  );
};

export default MobileGrantDetails;
