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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Calendar as CalendarIcon, User, Image as ImageIcon, Upload, X } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
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

const documentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().optional(),
  file: z.any().optional(),
  _id: z.string().optional(),
});

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  profilePicture: z.any().optional(),
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
  department: z.string().optional(),
  aadharNo: z.string().min(1, "Aadhar No is required"),
  pfNo: z.string().optional(),
  esiNo: z.string().optional(),
  doj: z.string().min(1, "D.O.J is required"),
  doe: z.string().optional().nullable(),
  permanentAddress: z.string().min(1, "Permanent address is required"),
  currentAddress: z.string().min(1, "Current address is required"),
  mobileNo: z.string().length(10, "Mobile No must be exactly 10 digits").regex(/^\d+$/, "Mobile No must contain only digits"),
  remarks: z.string().optional(),
  documents: z.array(documentSchema).optional(),
  createdBy: z.string().optional(),
});

export type EmployeeFormValues = z.infer<typeof formSchema>;

interface EmployeeFormProps {
  initialValues?: Partial<RegisterEmployeeDto>;
  onSubmit: (data: RegisterEmployeeDto | FormData) => void;
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
      profilePicture: initialValues?.profilePicture || null,
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
      department: initialValues?.department || "",
      aadharNo: initialValues?.aadharNo || "",
      pfNo: initialValues?.pfNo || "",
      esiNo: initialValues?.esiNo || "",
      doj: initialValues?.doj || "",
      permanentAddress: initialValues?.permanentAddress || "",
      currentAddress: initialValues?.currentAddress || "",
      mobileNo: initialValues?.mobileNo || "",
      remarks: initialValues?.remarks || "",
      documents: initialValues?.documents || [],
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

  const { fields: documentFields, append: appendDocument, remove: removeDocument } = useFieldArray({
    control: form.control,
    name: "documents",
  });

  const profilePicture = useWatch({
    control: form.control,
    name: "profilePicture",
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!profilePicture) {
      setPreviewUrl(null);
      return;
    }

    if (typeof profilePicture === 'string') {
      setPreviewUrl(profilePicture);
      return;
    }

    if (profilePicture instanceof File) {
      const url = URL.createObjectURL(profilePicture);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [profilePicture]);

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    // Map all simple string/number fields to formData
    Object.keys(values).forEach((key) => {
      let value = (values as any)[key];
      
      // Skip fields that need special handling
      if (
        ['familyDetails', 'academicQualification', 'previousWorkExperience', 'emergencyContact', 'documents', 'profilePicture'].includes(key)
      ) {
        return;
      }

      // Hardcode role to 'user' as requested
      if (key === 'role') {
        value = 'user';
      }

      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Handle nested objects and simple arrays as JSON strings
    formData.append('emergencyContact', JSON.stringify(values.emergencyContact));
    if (values.familyDetails) formData.append('familyDetails', JSON.stringify(values.familyDetails));
    if (values.academicQualification) formData.append('academicQualification', JSON.stringify(values.academicQualification));
    if (values.previousWorkExperience) formData.append('previousWorkExperience', JSON.stringify(values.previousWorkExperience));

    // Handle profile picture
    if (values.profilePicture instanceof File) {
      formData.append('profilePicture', values.profilePicture);
    }

    // Handle Documents and Files
    if (values.documents && values.documents.length > 0) {
      // First, we send the document metadata as a JSON string
      const docMetadata = values.documents.map(doc => ({
        title: doc.title,
        url: doc.url,
        _id: doc._id
      }));
      formData.append('documentsMetadata', JSON.stringify(docMetadata));

      // Then, we append each file to the 'files' field
      // The backend will likely match files by order or we can append indexed keys
      values.documents.forEach((doc, index) => {
        if (doc.file) {
          formData.append('files', doc.file);
        }
      });
    }

    onSubmit(formData as any);
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
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Engineering" {...field} />
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
                              {field.value && isValid(parseISO(field.value)) ? (
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
                            selected={field.value && isValid(parseISO(field.value)) ? parseISO(field.value) : undefined}
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
              
              <div className="flex flex-col items-center justify-center space-y-3 mb-4">
                <FormField
                  control={form.control}
                  name="profilePicture"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormControl>
                        <div className="relative group cursor-pointer">
                          <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 group-hover:border-primary transition-all duration-200 shadow-sm">
                            {previewUrl ? (
                              <img 
                                src={previewUrl} 
                                alt="Profile Preview" 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="flex flex-col items-center text-slate-400 group-hover:text-primary transition-colors">
                                <User className="w-8 h-8 mb-1" />
                                <span className="text-[10px] font-medium">Upload</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Upload className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <input 
                            type="file" 
                            accept="image/jpeg,image/jpg,image/png"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            style={{ fontSize: 0 }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const allowed = ["image/jpeg", "image/jpg", "image/png"];
                              if (!allowed.includes(file.type)) return;
                              onChange(file);
                            }}
                            name={fieldProps.name}
                            onBlur={fieldProps.onBlur}
                            ref={fieldProps.ref}
                          />
                          {value && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onChange(null);
                              }}
                              className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-1 shadow-lg hover:bg-rose-600 transition-colors z-10"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </FormControl>
                      <FormLabel className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Profile Photo</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                              {field.value && isValid(parseISO(field.value)) ? (
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
                            selected={field.value && isValid(parseISO(field.value)) ? parseISO(field.value) : undefined}
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

              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Other Documents</h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendDocument({ title: "", url: "" })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Document
                  </Button>
                </div>
                {documentFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-2 gap-4 p-4 border rounded-xl bg-slate-50/30">
                    <FormField
                      control={form.control}
                      name={`documents.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px]">Document Title</FormLabel>
                          <FormControl><Input placeholder="e.g. Voter ID, Passport" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2 items-end">
                      <FormField
                        control={form.control}
                        name={`documents.${index}.file`}
                        render={({ field: { value, onChange, ...fieldProps } }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-[10px]">Upload Document</FormLabel>
                            <FormControl>
                              <Input 
                                type="file" 
                                className="h-9 cursor-pointer file:bg-slate-100 file:border-0 file:rounded-md file:text-[10px] file:font-bold hover:file:bg-slate-200"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) onChange(file);
                                }}
                                name={fieldProps.name}
                                onBlur={fieldProps.onBlur}
                                ref={fieldProps.ref}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button variant="ghost" size="icon" className="text-rose-500" onClick={() => removeDocument(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional notes about the employee..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
