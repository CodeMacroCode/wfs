"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, useWatch, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RegisterEmployeeDto } from "@/types/employee";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { authStorage } from "@/lib/auth";
import { cn } from "@/lib/utils";

const familyMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relation: z.string().min(1, "Relation is required"),
  age: z.coerce.number().min(0, "Age must be positive"),
  _id: z.string().optional(),
});

const academicQualificationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institute: z.string().min(1, "Institute is required"),
  year: z.string().min(1, "Year is required"),
  _id: z.string().optional(),
});

const workExperienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  years: z.string().min(1, "Years is required"),
  _id: z.string().optional(),
});

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  role: z.enum(["user", "hr", "admin"]),
  uniqueId: z.preprocess((val) => Number(val), z.number().min(1, "Unique ID is required")),
  otherName: z.string().optional(),
  gender: z.enum(["male", "female", "other"]),
  fatherName: z.string().min(1, "Father's name is required"),
  motherName: z.string().min(1, "Mother's name is required"),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"]),
  familyDetails: z.array(familyMemberSchema).optional(),
  dob: z.string().min(1, "D.O.B is required"),
  bloodGroup: z.string().min(1, "Blood Group is required"),
  emergencyContact: z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().length(10, "Phone must be exactly 10 digits").regex(/^\d+$/, "Phone must contain only digits"),
    relation: z.string().min(1, "Relation is required"),
  }),
  reference: z.string().optional(),
  academicQualification: z.array(academicQualificationSchema).optional(),
  previousWorkExperience: z.array(workExperienceSchema).optional(),
  designation: z.string().min(1, "Designation is required"),
  aadharNo: z.string().min(1, "Aadhar No is required"),
  pfNo: z.string().optional(),
  esiNo: z.string().optional(),
  doj: z.string().min(1, "D.O.J is required"),
  doe: z.string().optional().nullable(),
  permanentAddress: z.string().min(1, "Permanent address is required"),
  currentAddress: z.string().min(1, "Current address is required"),
  mobileNo: z.string().length(10, "Mobile No must be exactly 10 digits").regex(/^\d+$/, "Mobile No must contain only digits"),
  createdBy: z.string().optional(),
});

export type EmployeeFormValues = z.infer<typeof formSchema>;

interface EmployeeFormProps {
  initialValues?: Partial<RegisterEmployeeDto>;
  onSubmit: (data: RegisterEmployeeDto) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function EmployeeForm({
  initialValues,
  onSubmit,
  isLoading,
  isEdit = false,
}: EmployeeFormProps) {
  const user = authStorage.getUser();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(formSchema) as Resolver<EmployeeFormValues>,
    defaultValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      password: initialValues?.password || (isEdit ? undefined : ""),
      role: initialValues?.role || "user",
      uniqueId: initialValues?.uniqueId || 0,
      otherName: initialValues?.otherName || "",
      gender: (initialValues?.gender?.toLowerCase() as "male" | "female" | "other") || "male",
      fatherName: initialValues?.fatherName || "",
      motherName: initialValues?.motherName || "",
      maritalStatus: (initialValues?.maritalStatus?.toLowerCase() as "single" | "married" | "divorced" | "widowed") || "single",
      familyDetails: initialValues?.familyDetails || [],
      dob: initialValues?.dob || "",
      bloodGroup: initialValues?.bloodGroup || "",
      emergencyContact: {
        name: initialValues?.emergencyContact?.name || "",
        phone: initialValues?.emergencyContact?.phone || "",
        relation: initialValues?.emergencyContact?.relation || "",
      },
      reference: initialValues?.reference || "",
      academicQualification: initialValues?.academicQualification || [{ degree: "", institute: "", year: "" }],
      previousWorkExperience: initialValues?.previousWorkExperience || [],
      designation: initialValues?.designation || "",
      aadharNo: initialValues?.aadharNo || "",
      pfNo: initialValues?.pfNo || "",
      esiNo: initialValues?.esiNo || "",
      doj: initialValues?.doj || "",
      permanentAddress: initialValues?.permanentAddress || "",
      currentAddress: initialValues?.currentAddress || "",
      mobileNo: initialValues?.mobileNo || "",
      createdBy: initialValues?.createdBy || user?.id || "",
    },
  });

  const currentAddress = useWatch({
    control: form.control,
    name: "currentAddress",
  });
  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  useEffect(() => {
    if (sameAsCurrent) {
      form.setValue("permanentAddress", currentAddress, { shouldValidate: true });
    }
  }, [sameAsCurrent, currentAddress, form]);

  const { fields: academicFields, append: appendAcademic, remove: removeAcademic } = useFieldArray({
    control: form.control,
    name: "academicQualification",
  });

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control: form.control,
    name: "previousWorkExperience",
  });

  const { fields: familyFields, append: appendFamily, remove: removeFamily } = useFieldArray({
    control: form.control,
    name: "familyDetails",
  });

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data as RegisterEmployeeDto);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <ScrollArea className="h-[65vh] pr-4">
          <div className="space-y-8">
            {/* Section 1: Professional Access */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider bg-slate-50 p-2 rounded">
                1. Professional & Access
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="uniqueId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unique ID (From Punch Machine)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Input placeholder="Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="doj"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="mb-2">D.O.J (Joining)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal h-9 rounded-lg border-input bg-background/50 hover:bg-white transition-colors",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(parseISO(field.value), "PPP")
                              ) : (
                                <span>Pick joining date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 text-slate-400" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            selected={field.value ? parseISO(field.value) : undefined}
                            onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                            startMonth={new Date(2000, 0)}
                            endMonth={new Date(new Date().getFullYear() + 10, 0)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>System Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="hr">HR</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          {...field}
                          disabled={isEdit}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!isEdit && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <Separator />

            {/* Section 2: Personal Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider bg-slate-50 p-2 rounded">
                2. Personal Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="otherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Alias" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="mb-2">Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal h-9 rounded-lg border-input bg-background/50 hover:bg-white transition-colors",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(parseISO(field.value), "PPP")
                              ) : (
                                <span>Pick birth date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 text-slate-400" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            selected={field.value ? parseISO(field.value) : undefined}
                            onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            startMonth={new Date(1900, 0)}
                            endMonth={new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group</FormLabel>
                      <FormControl>
                        <Input placeholder="O+" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Section 3: Family & Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider bg-slate-50 p-2 rounded">
                3. Family & Contact
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fatherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Father&apos;s Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="motherName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mother&apos;s Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobileNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile No</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" {...field} maxLength={10} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContact.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Contact Person" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContact.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone Number" {...field} maxLength={10} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContact.relation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Relation</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Spouse, Parent" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Family Members</h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendFamily({ name: "", relation: "", age: 0 })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Member
                  </Button>
                </div>
                {familyFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-3 gap-4 p-4 border rounded-xl relative bg-slate-50/50">
                    <FormField
                      control={form.control}
                      name={`familyDetails.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px]">Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`familyDetails.${index}.relation`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px]">Relation</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2 items-end">
                      <FormField
                        control={form.control}
                        name={`familyDetails.${index}.age`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-[10px]">Age</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button variant="ghost" size="icon" className="text-rose-500" onClick={() => removeFamily(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference (If any)</FormLabel>
                    <FormControl>
                      <Input placeholder="Referred by..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-2 my-2">
                <Checkbox 
                  id="same-as-current" 
                  checked={sameAsCurrent} 
                  onCheckedChange={(checked) => setSameAsCurrent(!!checked)} 
                />
                <Label htmlFor="same-as-current" className="text-xs text-slate-500 font-medium cursor-pointer">
                  Same as current address
                </Label>
              </div>
              <FormField
                control={form.control}
                name="permanentAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permanent Address</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={sameAsCurrent} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Section 4: Documentation & Education */}
            <div className="space-y-4 pb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider bg-slate-50 p-2 rounded">
                4. Documentation & Qualification
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Academic Qualifications</h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendAcademic({ degree: "", institute: "", year: "" })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Qualification
                  </Button>
                </div>
                {academicFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-3 gap-4 p-4 border rounded-xl bg-amber-50/20">
                    <FormField
                      control={form.control}
                      name={`academicQualification.${index}.degree`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px]">Degree</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`academicQualification.${index}.institute`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px]">Institute</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2 items-end">
                      <FormField
                        control={form.control}
                        name={`academicQualification.${index}.year`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-[10px]">Year</FormLabel>
                            <FormControl><Input placeholder="2020" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button variant="ghost" size="icon" className="text-rose-500" onClick={() => removeAcademic(index)} disabled={academicFields.length === 1}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Previous Work Experience</h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendExperience({ company: "", role: "", years: "" })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Experience
                  </Button>
                </div>
                {experienceFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-3 gap-4 p-4 border rounded-xl bg-slate-50/50">
                    <FormField
                      control={form.control}
                      name={`previousWorkExperience.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px]">Company</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`previousWorkExperience.${index}.role`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px]">Role</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2 items-end">
                      <FormField
                        control={form.control}
                        name={`previousWorkExperience.${index}.years`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-[10px]">Years</FormLabel>
                            <FormControl><Input placeholder="2" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button variant="ghost" size="icon" className="text-rose-500" onClick={() => removeExperience(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="aadharNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhar NO</FormLabel>
                      <FormControl>
                        <Input placeholder="12 Digit No" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pfNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PF NO.</FormLabel>
                      <FormControl>
                        <Input placeholder="PF Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="esiNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ESI NO.</FormLabel>
                      <FormControl>
                        <Input placeholder="ESI Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="submit"
            className="bg-[#2eb88a] hover:bg-[#259b74]"
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : isEdit
                ? "Update Employee"
                : "Register Employee"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
