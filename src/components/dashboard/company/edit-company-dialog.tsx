"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Building2, Pencil } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUpdateCompanyMutation } from "@/hooks/queries/use-company"
import { Company } from "@/types/company"

const formSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  gstNumber: z.string().optional(),
  prefix: z.string().optional(),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface EditCompanyDialogProps {
  company: Company
  trigger?: React.ReactNode
}

export function EditCompanyDialog({ company, trigger }: EditCompanyDialogProps) {
  const [open, setOpen] = React.useState(false)
  const updateMutation = useUpdateCompanyMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: company.name,
      email: company.email || "",
      phone: company.phone || "",
      address: company.address || "",
      gstNumber: company.gstNumber || "",
      prefix: company.prefix || "",
      isActive: company.isActive,
    },
  })

  // Sync form values when company prop changes
  React.useEffect(() => {
    if (open) {
      form.reset({
        name: company.name,
        email: company.email || "",
        phone: company.phone || "",
        address: company.address || "",
        gstNumber: company.gstNumber || "",
        prefix: company.prefix || "",
        isActive: company.isActive,
      })
    }
  }, [open, company, form])

  const onSubmit = async (values: FormValues) => {
    try {
      await updateMutation.mutateAsync({
        id: company._id,
        data: {
          name: values.name,
          email: values.email || undefined,
          phone: values.phone || undefined,
          address: values.address || undefined,
          gstNumber: values.gstNumber || undefined,
          prefix: values.prefix || undefined,
          isActive: values.isActive,
        },
      })
      setOpen(false)
    } catch {
      // error handled in mutation
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Edit Company</DialogTitle>
              <DialogDescription className="text-sm text-slate-500 mt-0.5">
                Update the details for <strong>{company.name}</strong>.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2 w-full">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Company Name <span className="text-rose-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. TechNova Solutions Pvt Ltd" {...field} className="h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="info@company.com" type="email" {...field} className="h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="9876543210" {...field} className="h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Plot 45, IT Park, Nagpur" {...field} className="h-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gstNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST Number</FormLabel>
                    <FormControl>
                      <Input placeholder="27ABCDE1234F1Z5" {...field} className="h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prefix</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. TN" {...field} className="h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={field.value ? "true" : "false"}
                    onValueChange={(val) => field.onChange(val === "true")}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
