import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addGrant, updateGrant } from "../store/grantSlice";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Alert, AlertDescription } from "../components/ui/alert";
import { ArrowLeft, Plus, X, DollarSign } from "lucide-react";
import type { Grant } from "../store/grantSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { RootState } from "../store/store";
import { FrameMotionWrapper } from "@/components/framer-motion";

interface FormData {
  company: string;
  grantDate: string;
  numberOfShares: string;
  grantPrice: string;
  vestingSchedule: "standard" | "custom";
  customVesting: Array<{
    vestingDate: string;
    percentageVested: string;
  }>;
}
const COMPANY_SYMBOLS: { [key: string]: string } = {
  "Apple Inc.": "AAPL",
  "Google LLC": "GOOGL",
  "Microsoft Corp": "MSFT",
  "Tesla Inc.": "TSLA",
  "Amazon.com Inc.": "AMZN",
  "Meta Platforms": "META",
  "NVIDIA Corporation": "NVDA",
  "Netflix Inc.": "NFLX",
};

const AddEditGrantPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const grantId = searchParams.get("id");
  const grant = useSelector((state: RootState) =>
    state.grants.grants.find((g) => g.id === grantId)
  );
  const isEditing = !!grant;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: grant
      ? {
          company: grant.company,
          grantDate: grant.grantDate,
          numberOfShares: grant.numberOfShares.toString(),
          grantPrice: grant.grantPrice.toString(),
          vestingSchedule: grant.vestingSchedule,
          customVesting:
            grant.customVesting?.map((v) => ({
              vestingDate: v.vestingDate,
              percentageVested: v.percentageVested.toString(),
            })) || [],
        }
      : {
          company: "",
          grantDate: "",
          numberOfShares: "",
          grantPrice: "",
          vestingSchedule: "standard",
          customVesting: [],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customVesting",
  });

  const vestingSchedule = watch("vestingSchedule");

  const onSubmit = (data: FormData) => {
    const grantData: Grant = {
      id: grant?.id || uuidv4(),
      company: data.company,
      symbol: COMPANY_SYMBOLS[data.company] || "UNKNOWN",
      grantDate: data.grantDate,
      numberOfShares: parseInt(data.numberOfShares),
      grantPrice: parseFloat(data.grantPrice),
      vestingSchedule: data.vestingSchedule,
      customVesting:
        data.vestingSchedule === "custom"
          ? data.customVesting.map((v) => ({
              vestingDate: v.vestingDate,
              percentageVested: parseFloat(v.percentageVested),
            }))
          : undefined,
      currentPrice: grant?.currentPrice,
    };

    if (isEditing) {
      dispatch(updateGrant(grantData));
    } else {
      dispatch(addGrant(grantData));
    }

    navigate("/all-grants");
  };

  const addCustomVestingRow = () => {
    append({ vestingDate: "", percentageVested: "" });
  };

  return (
    <FrameMotionWrapper key="addEditGrant">
      <div className=" mobile-container ">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold ">
            {isEditing ? "Edit Grant" : "Add Grant"}
          </h1>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Grant Details" : "Grant Details"}
            </CardTitle>
            <CardDescription>
              {isEditing
                ? "Update the grant information below."
                : "Fill in the details for your new grant."}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Select
                  onValueChange={(value) => setValue("company", value)}
                  defaultValue={grant?.company}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(COMPANY_SYMBOLS).map((company) => (
                      <SelectItem key={company} value={company}>
                        {company} ({COMPANY_SYMBOLS[company]})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.company && (
                  <Alert variant="destructive">
                    <AlertDescription>Company is required</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="grantDate">Grant Date</Label>
                <Input
                  id="grantDate"
                  type="date"
                  {...register("grantDate", {
                    required: "Grant date is required",
                  })}
                  className="w-full"
                />
                {errors.grantDate && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {errors.grantDate.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfShares">Number of Shares</Label>
                <Input
                  id="numberOfShares"
                  type="number"
                  placeholder="e.g., 1000"
                  {...register("numberOfShares", {
                    required: "Number of shares is required",
                    min: { value: 1, message: "Must be at least 1 share" },
                  })}
                />
                {errors.numberOfShares && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {errors.numberOfShares.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="grantPrice">Grant Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    id="grantPrice"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 150.25"
                    className="pl-10"
                    {...register("grantPrice", {
                      required: "Grant price is required",
                      min: {
                        value: 0.01,
                        message: "Price must be greater than 0",
                      },
                    })}
                  />
                </div>
                {errors.grantPrice && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {errors.grantPrice.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-4">
                <Label>Vesting Schedule</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={
                      vestingSchedule === "standard" ? "default" : "outline"
                    }
                    onClick={() => setValue("vestingSchedule", "standard")}
                    className="flex-1"
                  >
                    Standard
                  </Button>
                  <Button
                    type="button"
                    variant={
                      vestingSchedule === "custom" ? "default" : "outline"
                    }
                    onClick={() => setValue("vestingSchedule", "custom")}
                    className="flex-1"
                  >
                    Custom
                  </Button>
                </div>

                {vestingSchedule === "standard" && (
                  <div className=" p-4 rounded-lg space-y-3">
                    <p className="text-sm ">
                      Standard 4-year schedule with a 1-year cliff. 25% of
                      shares vest annually.
                    </p>
                  </div>
                )}

                {vestingSchedule === "custom" && (
                  <div className="space-y-4">
                    <div className=" p-4 rounded-lg">
                      <h4 className="font-medium mb-3">
                        Custom Vesting Schedule
                      </h4>

                      {fields.length === 0 && (
                        <p className="text-sm  mb-3">
                          No custom vesting dates added yet.
                        </p>
                      )}

                      <div className="space-y-3">
                        {fields.map((field, index) => (
                          <div key={field.id} className="flex gap-3 items-end">
                            <div className="flex-1">
                              <Label htmlFor={`vestingDate-${index}`}>
                                Vesting Date
                              </Label>
                              <Input
                                id={`vestingDate-${index}`}
                                type="date"
                                {...register(
                                  `customVesting.${index}.vestingDate` as const,
                                  {
                                    required: "Vesting date is required",
                                  }
                                )}
                              />
                            </div>
                            <div className="flex-1">
                              <Label htmlFor={`percentage-${index}`}>
                                Percentage Vested
                              </Label>
                              <div className="relative">
                                <Input
                                  id={`percentage-${index}`}
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  max="100"
                                  placeholder="e.g., 25"
                                  className="pr-8"
                                  {...register(
                                    `customVesting.${index}.percentageVested` as const,
                                    {
                                      required: "Percentage is required",
                                      min: {
                                        value: 0,
                                        message: "Must be >= 0",
                                      },
                                      max: {
                                        value: 100,
                                        message: "Must be <= 100",
                                      },
                                    }
                                  )}
                                />
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                                  %
                                </span>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => remove(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addCustomVestingRow}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Row
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update Grant" : "Add Grant"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </FrameMotionWrapper>
  );
};

export default AddEditGrantPage;
