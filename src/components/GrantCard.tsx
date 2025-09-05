import React from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Building2, Calendar, Edit, Trash2, Eye } from "lucide-react";
import type { Grant } from "../store/grantSlice";

interface GrantCardProps {
  grant: Grant;
  onEdit: (grant: Grant) => void;
  onDelete: (grantId: string) => void;
  onViewDetails: (grant: Grant) => void;
}

export const calculateVestedShares = (grant: Grant) => {
  if (grant.vestingSchedule === "standard") {
    const grantDate = new Date(grant.grantDate);
    const now = new Date();
    const yearsPassed = Math.floor(
      (now.getTime() - grantDate.getTime()) / (365 * 24 * 60 * 60 * 1000)
    );
    return Math.min(
      yearsPassed * 0.25 * grant.numberOfShares,
      grant.numberOfShares
    );
  } else if (grant.customVesting) {
    const now = new Date();
    let vestedPercentage = 0;

    grant.customVesting.forEach((vesting) => {
      if (new Date(vesting.vestingDate) <= now) {
        vestedPercentage += vesting.percentageVested;
      }
    });

    return (vestedPercentage / 100) * grant.numberOfShares;
  }
  return 0;
};

const GrantCard: React.FC<GrantCardProps> = ({
  grant,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const vestedShares = Math.floor(calculateVestedShares(grant));

  const currentValue = vestedShares * (grant.currentPrice || grant.grantPrice);
  const grantValue = grant.numberOfShares * grant.grantPrice;
  const gain = currentValue - grantValue;
  const gainPercent = ((gain / grantValue) * 100).toFixed(2);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-500" />
            <div>
              <h3 className="font-semibold text-lg">{grant.company}</h3>
              <p className="text-sm text-slate-500">{grant.symbol}</p>
            </div>
          </div>
          <div
            className={`text-right ${
              gain >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <p className="font-semibold">
              {gain >= 0 ? "+" : ""}
              {gainPercent}%
            </p>
            <p className="text-sm">${gain.toFixed(2)}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Total Shares</span>
            <span className="font-medium">
              {grant.numberOfShares.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Vested Shares</span>
            <span className="font-medium">{vestedShares.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Grant Price</span>
            <span className="font-medium">${grant.grantPrice.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Current Price</span>
            <span className="font-medium">
              ${(grant.currentPrice || grant.grantPrice).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Current Value</span>
            <span className="font-semibold text-lg">
              $
              {currentValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="w-4 h-4" />
            <span>
              Granted {new Date(grant.grantDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(grant)}
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(grant)}
          className="flex-1"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(grant.id)}
          className="flex-1 text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GrantCard;
