"use client";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupIndicator,
} from "@radix-ui/react-radio-group";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { CalendarIcon, Circle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
// 定義 Zod schema
const passengerSchema = z
  .object({
    userName: z
      .string()
      .min(1, "* 名字不能小於 1 個字符")
      .max(20, "* 名字不能超過 20 個字符"),
    birthday: z
      .date({
        required_error: "* 必填",
      })
      .refine(
        (date) => {
          const ageDiff = today.getFullYear() - date.getFullYear();
          return ageDiff >= 2;
        },
        {
          message: "* 年紀須滿 2 歲以上",
        }
      ),
    addSell: z.array(z.enum(["add0", "add15", "add20"])),
  })
  .superRefine((values, ctx) => {
    const { birthday } = values;
  });
type TPassenger = z.infer<typeof passengerSchema>;

const FormSchema = z.object({
  passengerInfos: z.array(passengerSchema),
});

const today = new Date();

export default function SelectForm() {
  const [passengerCount, setPassengerCount] = useState("0");
  const [isFormDisplayed, setIsFormDisplayed] = useState(false);
  const initValue = Array.from({ length: +passengerCount }).fill({
    userName: "",
    birthday: undefined,
    addSell: ["add0"],
  }) as TPassenger[];
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      passengerInfos: initValue,
    },
    resolver: zodResolver(FormSchema),
  });

  const { handleSubmit, setError, control, reset } = form;
  const { fields } = useFieldArray({
    control,
    name: "passengerInfos",
  });

  useEffect(() => {
    reset({ passengerInfos: initValue });
  }, [passengerCount, reset]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const isOver18YearOld = data.passengerInfos.findIndex(
      (passenger: TPassenger) => {
        return today.getFullYear() - passenger.birthday.getFullYear() >= 18;
      }
    );

    if (isOver18YearOld === -1) {
      setError(`passengerInfos.${0}.birthday`, {
        type: "custom",
        message: "*機票需至少有1人滿18歲，請聯繫客服人員，謝謝",
      });
    } else {
      alert("訂單已送出");
    }
  }

  return (
    <div className="max-w-[375px] p-2 h-dvh w-full m-auto flex-col items-center justify-center mt-10">
      <h1 className="text-xl font-bold mb-2 border-b border-black">動態表單</h1>
      {!isFormDisplayed && (
        <div className="flex flex-col gap-2">
          <Label>選擇人數</Label>
          <Select
            value={passengerCount}
            onValueChange={(value) => setPassengerCount(value)}
          >
            <SelectTrigger>
              <SelectValue>{passengerCount}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            disabled={passengerCount === "0" || isFormDisplayed}
            onClick={() => setIsFormDisplayed(true)}
          >
            確認
          </Button>
        </div>
      )}
      {isFormDisplayed && (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full p-2 space-y-6 border border-border rounded">
            {fields.map((field, index) => (
              <div key={field.id} className="bg-slate-200 p-3 flex flex-col gap-3 rounded">
                <FormField
                  control={control}
                  name={`passengerInfos.${index}.userName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">旅客</FormLabel>
                      <FormControl>
                        <Input placeholder="王大明" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`passengerInfos.${index}.birthday`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-bold">生日</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>選擇日期</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            className="bg-background border border-border"
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            captionLayout="dropdown-buttons"
                            fromYear={1900}
                            toYear={today.getFullYear()}
                            disabled={(date: Date) =>
                              date > today || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`passengerInfos.${index}.addSell`}
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="font-bold">加購行李</FormLabel>
                      <FormControl>
                        <>
                          {field.value.map((_, addSellIndex) => (
                            <RadioGroup
                              key={addSellIndex}
                              onValueChange={(value) => {
                                const updatedAddSell = [...field.value];
                                updatedAddSell[addSellIndex] = value as
                                  | "add0"
                                  | "add15"
                                  | "add20";
                                field.onChange(updatedAddSell);
                              }}
                              defaultValue={field.value[addSellIndex]}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    value="add0"
                                    className="aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-slate-200"
                                  >
                                    <RadioGroupIndicator className="flex items-center justify-center">
                                      <Circle className="h-2.5 w-2.5 fill-current text-current" />
                                    </RadioGroupIndicator>
                                  </RadioGroupItem>
                                </FormControl>
                                <FormLabel className="font-normal">
                                  無加購行李
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    value="add15"
                                    className="aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-slate-200"
                                  >
                                    <RadioGroupIndicator className="flex items-center justify-center">
                                      <Circle className="h-2.5 w-2.5 fill-current text-current" />
                                    </RadioGroupIndicator>
                                  </RadioGroupItem>
                                </FormControl>
                                <FormLabel className="font-normal">
                                  加購行李 15 公斤
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    value="add20"
                                    className="aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-slate-200"
                                  >
                                    <RadioGroupIndicator className="flex items-center justify-center">
                                      <Circle className="h-2.5 w-2.5 fill-current text-current" />
                                    </RadioGroupIndicator>
                                  </RadioGroupItem>
                                </FormControl>
                                <FormLabel className="font-normal">
                                  加購行李 20 公斤
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          ))}
                        </>
                      </FormControl>
                      <Button
                        type="button"
                        onClick={() => field.onChange([...field.value, "add0"])}
                      >
                        新增行李選項
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )}
    </div>
  );
}
