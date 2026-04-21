"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RegisterEmployeeDto, EmergencyContact } from "@/types/employee";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Calendar as CalendarIcon, User, Upload, X } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { authStorage } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useAttendancePoliciesQuery } from "@/hooks/queries/use-attendance-policies";
import { usePayrollPoliciesQuery } from "@/hooks/queries/use-payroll-policies";
import { useCompanyQuery } from "@/hooks/queries/use-company";
import { useEmployeeIdDropdownQuery } from "@/hooks/queries/use-employees-query";
import { AvailableEmployeeIdDialog } from "./available-employee-id-dialog";

const emergencyContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relation: z.string().min(1, "Relation is required"),
  phone: z.string().length(10, "Phone must be 10 digits").regex(/^\d+$/, "Phone must contain only digits"),
});

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
  profileImage: z.any().optional(),
  email: z.string().email("Invalid email address"),
  role: z.enum(["user", "hr", "admin"]),
  uniqueId: z.string().optional(),      // punch machine employeeId string (e.g. "Tech-001")
  employeeObjId: z.string().optional(), // _id of the selected employee-id record
  companyId: z.string().optional(),
  attendancePolicyId: z.string().optional(),
  payrollPolicyId: z.string().optional(),
  otherName: z.string().optional(),
  category: z.string().optional(),
  gender: z.enum(["male", "female", "other"]),
  fatherName: z.string().min(1, "Father's name is required"),
  motherName: z.string().min(1, "Mother's name is required"),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"]),
  familyDetails: z.array(familyMemberSchema).optional(),
  dob: z.string().min(1, "D.O.B is required"),
  bloodGroup: z.string().min(1, "Blood Group is required"),
  emergencyContact: emergencyContactSchema.optional(),
  reference: z.string().optional(),
  academicQualification: z.array(academicQualificationSchema).optional(),
  previousWorkExperience: z.array(workExperienceSchema).optional(),
  designation: z.string().min(1, "Designation is required"),
  department: z.string().optional(),
  workingHours: z.string().optional(),
  aadharNo: z.string().min(1, "Aadhar No is required"),
  pfNo: z.string().optional(),
  esiNo: z.string().optional(),
  doj: z.string().min(1, "D.O.J is required"),
  doe: z.string().optional().nullable(),
  permanentAddress: z.string().min(1, "Permanent address is required"),
  currentAddress: z.string().min(1, "Current address is required"),
  mobileNo: z.string().length(10, "Mobile No must be exactly 10 digits").regex(/^\d+$/, "Mobile No must contain only digits"),
  notes: z.string().optional(),
  documents: z.array(documentSchema).optional(),
  password: z.string().optional(),
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
  const { data: attendancePoliciesData } = useAttendancePoliciesQuery();
  const { data: payrollPoliciesData } = usePayrollPoliciesQuery();
  const { data: companyData } = useCompanyQuery({ limit: 100 });

  // Helper to extract ID from potentially populated field
  const extractId = (val: unknown) => {
    if (!val) return "";
    if (typeof val === 'object' && val !== null && '_id' in val) {
      return (val as { _id: string })._id;
    }
    return String(val);
  };

  // Helper to format ISO date to yyyy-MM-dd
  const formatISOToDate = (isoString?: string) => {
    if (!isoString) return "";
    const date = parseISO(isoString);
    if (!isValid(date)) return "";
    return format(date, "yyyy-MM-dd");
  };

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(formSchema) as Resolver<EmployeeFormValues>,
    defaultValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      profileImage: initialValues?.profileImage || initialValues?.profilePicture || null,
      role: initialValues?.role || "user",
      uniqueId: initialValues?.uniqueId?.toString() || "",
      employeeObjId: extractId(initialValues?.employeeObjId),
      companyId: extractId(initialValues?.companyId),
      attendancePolicyId: extractId(initialValues?.attendancePolicyId),
      payrollPolicyId: extractId(initialValues?.payrollPolicyId),
      otherName: initialValues?.otherName || "",
      category: initialValues?.category || "",
      gender: (initialValues?.gender?.toLowerCase() as "male" | "female" | "other") || "male",
      fatherName: initialValues?.fatherName || "",
      motherName: initialValues?.motherName || "",
      maritalStatus: (initialValues?.maritalStatus?.toLowerCase() as "single" | "married" | "divorced" | "widowed") || "single",
      familyDetails: initialValues?.familyDetails || [],
      dob: formatISOToDate(initialValues?.dob),
      bloodGroup: initialValues?.bloodGroup || "",
      emergencyContact: {
        name: (initialValues?.emergencyContact as EmergencyContact)?.name || "",
        relation: (initialValues?.emergencyContact as EmergencyContact)?.relation || "",
        phone: (initialValues?.emergencyContact as EmergencyContact)?.phone || (typeof initialValues?.emergencyContact === 'string' ? initialValues?.emergencyContact : ""),
      },
      reference: initialValues?.reference || "",
      academicQualification: initialValues?.academicQualification?.length ? initialValues.academicQualification : [{ degree: "", institute: "", year: "" }],
      previousWorkExperience: initialValues?.previousWorkExperience || [],
      designation: initialValues?.designation || "",
      department: initialValues?.department || "",
      workingHours: initialValues?.workingHours || "",
      aadharNo: initialValues?.aadharNo || "",
      pfNo: initialValues?.pfNo || "",
      esiNo: initialValues?.esiNo || "",
      doj: formatISOToDate(initialValues?.doj),
      permanentAddress: initialValues?.permanentAddress || "",
      currentAddress: initialValues?.currentAddress || "",
      mobileNo: initialValues?.mobileNo || "",
      notes: initialValues?.notes || "",
      documents: initialValues?.documents || [],
      password: "123456",
      createdBy: initialValues?.createdBy || user?.id || "",
    },
  });

  const companies = companyData?.data || [];
  const companyId = useWatch({ control: form.control, name: "companyId" });
  const selectedCompany = companies.find(c => c._id === companyId);
  const prefix = selectedCompany?.prefix;

  const { data: employeeIdData } = useEmployeeIdDropdownQuery({ companyId, prefix });

  // Reset employeeObjId when companyId changes to ensure consistency
  useEffect(() => {
    // Only reset if it's not the initial load or if companyId actually changed from its previous value
    if (form.formState.isDirty && form.getValues("employeeObjId")) {
      form.setValue("employeeObjId", "", { shouldDirty: true });
    }
  }, [companyId, form]);

  const currentAddress = useWatch({ control: form.control, name: "currentAddress" });
  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  useEffect(() => {
    if (sameAsCurrent) {
      form.setValue("permanentAddress", currentAddress, { shouldValidate: true });
    }
  }, [sameAsCurrent, currentAddress, form]);

  const { fields: academicFields, append: appendAcademic, remove: removeAcademic } = useFieldArray({ control: form.control, name: "academicQualification" });
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({ control: form.control, name: "previousWorkExperience" });
  const { fields: familyFields, append: appendFamily, remove: removeFamily } = useFieldArray({ control: form.control, name: "familyDetails" });
  const { fields: documentFields, append: appendDocument, remove: removeDocument } = useFieldArray({ control: form.control, name: "documents" });

  const profileImage = useWatch({ control: form.control, name: "profileImage" });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profileImage instanceof File) {
      const url = URL.createObjectURL(profileImage);
      // Use queueMicrotask to avoid synchronous setState warning in some strict lint rules
      queueMicrotask(() => setPreviewUrl(url));
      return () => URL.revokeObjectURL(url);
    }
    queueMicrotask(() => setPreviewUrl(null));
  }, [profileImage]);

  const displayPreview = typeof profileImage === 'string' ? profileImage : previewUrl;

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    // Simple scalar fields
    const skipFields = ['familyDetails', 'academicQualification', 'previousWorkExperience', 'documents', 'profileImage', 'emergencyContact'];

    Object.keys(values).forEach((key) => {
      if (skipFields.includes(key)) return;

      let value = (values as Record<string, unknown>)[key];
      // Skip employeeObjId — handled separately
      if (key === 'employeeObjId') return;
      // Hardcode role to 'user'
      if (key === 'role') value = 'user';

      if (value !== undefined && value !== null && value !== '') {
        // Send uniqueId as a number
        if (key === 'uniqueId') {
          const num = parseInt(value.toString(), 10);
          if (!isNaN(num)) formData.append(key, num.toString());
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Emergency Contact fields mapping
    if (values.emergencyContact) {
      formData.append('emergencyContact[name]', values.emergencyContact.name || '');
      formData.append('emergencyContact[relation]', values.emergencyContact.relation || '');
      formData.append('emergencyContact[phone]', values.emergencyContact.phone || '');
    }

    // Send employeeObjId (_id of the selected employee-id record)
    if (values.employeeObjId) {
      formData.append('employeeObjId', values.employeeObjId);
    }

    // Family details — individual indexed fields
    values.familyDetails?.forEach((member, i) => {
      formData.append(`familyDetails[${i}][name]`, member.name);
      formData.append(`familyDetails[${i}][relation]`, member.relation);
      formData.append(`familyDetails[${i}][age]`, member.age.toString());
    });

    // Academic qualification — individual indexed fields
    values.academicQualification?.forEach((qual, i) => {
      formData.append(`academicQualification[${i}][degree]`, qual.degree);
      formData.append(`academicQualification[${i}][institute]`, qual.institute);
      formData.append(`academicQualification[${i}][year]`, qual.year);
    });

    // Previous work experience — individual indexed fields
    values.previousWorkExperience?.forEach((exp, i) => {
      formData.append(`previousWorkExperience[${i}][company]`, exp.company);
      formData.append(`previousWorkExperience[${i}][role]`, exp.role);
      formData.append(`previousWorkExperience[${i}][years]`, exp.years);
    });

    // Profile image
    if (values.profileImage instanceof File) {
      formData.append('profileImage', values.profileImage);
    }

    // Other Documents: append each file + title pair separately
    if (values.documents && values.documents.length > 0) {
      values.documents.forEach((doc) => {
        if (doc.file instanceof File) {
          formData.append('otherDocuments', doc.file);
          formData.append('otherDocumentsTitle', doc.title);
        }
      });
    }

    onSubmit(formData);
  };

  const attendancePolicies = attendancePoliciesData?.policies || [];
  const payrollPolicies = (payrollPoliciesData as { data?: { _id: string; name: string }[] })?.data || [];
  
  // Memoize employee IDs to ensure the current employee's ID is included during edits
  const employeeIds = useMemo(() => {
    const list = [...(employeeIdData?.data || [])];
    if (isEdit && initialValues?.employeeObjId && typeof initialValues.employeeObjId === 'object') {
      const currentId = initialValues.employeeObjId as { _id: string; employeeId: string };
      const exists = list.some(item => item._id === currentId._id);
      if (!exists && currentId._id && currentId.employeeId) {
        // Satisfaction of the EmployeeDropdownItem type which requires more fields in some contexts
        list.unshift(currentId as typeof list[0]);
      }
    }
    return list;
  }, [employeeIdData?.data, isEdit, initialValues]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <ScrollArea className="h-[65vh] pr-4">
          <div className="space-y-8">

            {/* ── Section 1: Professional & Access ── */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider bg-slate-50 p-2 rounded">
                1. Professional & Access
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companies.map((c) => (
                            <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employeeObjId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select employee ID" /></SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper" className="mt-1">
                          {employeeIds.length > 0 ? (
                            employeeIds.map((emp) => (
                              <SelectItem key={emp._id} value={emp._id}>
                                {emp.employeeId}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectGroup>
                              <SelectLabel className="text-center py-4 px-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                                  No available IDs<br />for this company
                                </p>
                              </SelectLabel>
                              <div className="px-2 pb-2" onPointerDown={(e) => e.stopPropagation()}>
                                <AvailableEmployeeIdDialog 
                                  triggerLabel="Create Employee ID" 
                                  triggerClassName="w-full bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" 
                                />
                              </div>
                            </SelectGroup>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="uniqueId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unique ID (Punch Machine No.)</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g. 1001" {...field} /></FormControl>
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
                      <FormControl><Input placeholder="Developer" {...field} /></FormControl>
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
                      <FormControl><Input placeholder="Engineering" {...field} /></FormControl>
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
                              className={cn("w-full pl-3 text-left font-normal h-9 rounded-lg border-input bg-background/50 hover:bg-white transition-colors", !field.value && "text-muted-foreground")}
                            >
                              {field.value && isValid(parseISO(field.value)) ? format(parseISO(field.value), "PPP") : <span>Pick joining date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 text-slate-400" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" captionLayout="dropdown" selected={field.value && isValid(parseISO(field.value)) ? parseISO(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} startMonth={new Date(2000, 0)} endMonth={new Date(new Date().getFullYear() + 10, 0)} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="attendancePolicyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attendance Policy</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select policy" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {attendancePolicies.map((p) => (
                            <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="payrollPolicyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payroll Policy</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select policy" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {payrollPolicies.map((p) => (
                            <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                          ))}
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
                      <FormControl><Input placeholder="john@example.com" {...field} disabled={isEdit} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* ── Section 2: Personal Details ── */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider bg-slate-50 p-2 rounded">
                2. Personal Details
              </h3>

              {/* Profile Picture */}
              <div className="flex flex-col items-center justify-center space-y-3 mb-4">
                <FormField
                  control={form.control}
                  name="profileImage"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormControl>
                        <div className="relative group cursor-pointer">
                          <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 group-hover:border-primary transition-all duration-200 shadow-sm">
                            {displayPreview ? (
                              <Image src={displayPreview} alt="Profile Preview" width={96} height={96} className="w-full h-full object-cover" />
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
                              if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) return;
                              onChange(file);
                            }}
                            name={fieldProps.name}
                            onBlur={fieldProps.onBlur}
                            ref={fieldProps.ref}
                          />
                          {value && (
                            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(null); }} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-1 shadow-lg hover:bg-rose-600 transition-colors z-10">
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
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="otherName" render={({ field }) => (<FormItem><FormLabel>Other Name</FormLabel><FormControl><Input placeholder="Alias" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
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
                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal h-9 rounded-lg border-input bg-background/50 hover:bg-white transition-colors", !field.value && "text-muted-foreground")}>
                              {field.value && isValid(parseISO(field.value)) ? format(parseISO(field.value), "PPP") : <span>Pick birth date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 text-slate-400" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" captionLayout="dropdown" selected={field.value && isValid(parseISO(field.value)) ? parseISO(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} startMonth={new Date(1900, 0)} endMonth={new Date()} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="bloodGroup" render={({ field }) => (<FormItem><FormLabel>Blood Group</FormLabel><FormControl><Input placeholder="O+" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
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

            {/* ── Section 3: Family & Contact ── */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider bg-slate-50 p-2 rounded">
                3. Family & Contact
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="fatherName" render={({ field }) => (<FormItem><FormLabel>Father&apos;s Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="motherName" render={({ field }) => (<FormItem><FormLabel>Mother&apos;s Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="mobileNo" render={({ field }) => (<FormItem><FormLabel>Mobile No</FormLabel><FormControl><Input placeholder="9876543210" {...field} maxLength={10} /></FormControl><FormMessage /></FormItem>)} />
                <div className="col-span-2 grid grid-cols-3 gap-4 p-4 border rounded-xl bg-rose-50/20">
                  <FormField
                    control={form.control}
                    name="emergencyContact.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Name</FormLabel>
                        <FormControl><Input placeholder="Name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergencyContact.relation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relation</FormLabel>
                        <FormControl><Input placeholder="Relation" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergencyContact.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl><Input placeholder="Phone" {...field} maxLength={10} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Family Members */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Family Members</h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendFamily({ name: "", relation: "", age: 0 })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Member
                  </Button>
                </div>
                {familyFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-3 gap-4 p-4 border rounded-xl relative bg-slate-50/50">
                    <FormField control={form.control} name={`familyDetails.${index}.name`} render={({ field }) => (<FormItem><FormLabel className="text-[10px]">Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name={`familyDetails.${index}.relation`} render={({ field }) => (<FormItem><FormLabel className="text-[10px]">Relation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <div className="flex gap-2 items-end">
                      <FormField control={form.control} name={`familyDetails.${index}.age`} render={({ field }) => (<FormItem className="flex-1"><FormLabel className="text-[10px]">Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <Button variant="ghost" size="icon" className="text-rose-500" onClick={() => removeFamily(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>

              <FormField control={form.control} name="reference" render={({ field }) => (<FormItem><FormLabel>Reference (If any)</FormLabel><FormControl><Input placeholder="Referred by..." {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="currentAddress" render={({ field }) => (<FormItem><FormLabel>Current Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <div className="flex items-center space-x-2 my-2">
                <Checkbox id="same-as-current" checked={sameAsCurrent} onCheckedChange={(checked) => setSameAsCurrent(!!checked)} />
                <Label htmlFor="same-as-current" className="text-xs text-slate-500 font-medium cursor-pointer">Same as current address</Label>
              </div>
              <FormField control={form.control} name="permanentAddress" render={({ field }) => (<FormItem><FormLabel>Permanent Address</FormLabel><FormControl><Input {...field} disabled={sameAsCurrent} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <Separator />

            {/* ── Section 4: Documentation & Qualification ── */}
            <div className="space-y-4 pb-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider bg-slate-50 p-2 rounded">
                4. Documentation & Qualification
              </h3>

              {/* Academic Qualifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Academic Qualifications</h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendAcademic({ degree: "", institute: "", year: "" })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Qualification
                  </Button>
                </div>
                {academicFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-3 gap-4 p-4 border rounded-xl bg-amber-50/20">
                    <FormField control={form.control} name={`academicQualification.${index}.degree`} render={({ field }) => (<FormItem><FormLabel className="text-[10px]">Degree</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name={`academicQualification.${index}.institute`} render={({ field }) => (<FormItem><FormLabel className="text-[10px]">Institute</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <div className="flex gap-2 items-end">
                      <FormField control={form.control} name={`academicQualification.${index}.year`} render={({ field }) => (<FormItem className="flex-1"><FormLabel className="text-[10px]">Year</FormLabel><FormControl><Input placeholder="2020" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <Button variant="ghost" size="icon" className="text-rose-500" onClick={() => removeAcademic(index)} disabled={academicFields.length === 1}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Work Experience */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Previous Work Experience</h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendExperience({ company: "", role: "", years: "" })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Experience
                  </Button>
                </div>
                {experienceFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-3 gap-4 p-4 border rounded-xl bg-slate-50/50">
                    <FormField control={form.control} name={`previousWorkExperience.${index}.company`} render={({ field }) => (<FormItem><FormLabel className="text-[10px]">Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name={`previousWorkExperience.${index}.role`} render={({ field }) => (<FormItem><FormLabel className="text-[10px]">Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <div className="flex gap-2 items-end">
                      <FormField control={form.control} name={`previousWorkExperience.${index}.years`} render={({ field }) => (<FormItem className="flex-1"><FormLabel className="text-[10px]">Years</FormLabel><FormControl><Input placeholder="2" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <Button variant="ghost" size="icon" className="text-rose-500" onClick={() => removeExperience(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* IDs */}
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="aadharNo" render={({ field }) => (<FormItem><FormLabel>Aadhar NO</FormLabel><FormControl><Input placeholder="12 Digit No" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="pfNo" render={({ field }) => (<FormItem><FormLabel>PF NO.</FormLabel><FormControl><Input placeholder="PF Number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="esiNo" render={({ field }) => (<FormItem><FormLabel>ESI NO.</FormLabel><FormControl><Input placeholder="ESI Number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>

              {/* Other Documents */}
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
                          <FormControl><Input placeholder="e.g. Aadhar Card, Resume" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2 items-end">
                      <FormField
                        control={form.control}
                        name={`documents.${index}.file`}
                        render={({ field: { onChange, ...fieldProps } }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-[10px]">Upload File</FormLabel>
                            <FormControl>
                              <Input type="file" className="h-9 cursor-pointer file:bg-slate-100 file:border-0 file:rounded-md file:text-[10px] file:font-bold hover:file:bg-slate-200" onChange={(e) => { const file = e.target.files?.[0]; if (file) onChange(file); }} name={fieldProps.name} onBlur={fieldProps.onBlur} ref={fieldProps.ref} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button variant="ghost" size="icon" className="text-rose-500" onClick={() => removeDocument(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any additional notes about the employee..." className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="submit" className="bg-[#2eb88a] hover:bg-[#259b74]" disabled={isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Update Employee" : "Register Employee"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
