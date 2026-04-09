"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AssetForm } from "./asset-form"
import { Asset, CreateAssetDto } from "@/types/asset"
import { toast } from "sonner"

interface IssueAssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: CreateAssetDto) => void
}

export function IssueAssetDialog({ open, onOpenChange, onAdd }: IssueAssetDialogProps) {
  const onSubmit = (data: CreateAssetDto) => {
    onAdd(data)
    onOpenChange(false)
    toast.success("Asset issued successfully")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Issue New Asset</DialogTitle>
        </DialogHeader>
        <AssetForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  )
}

interface EditAssetDialogProps {
  asset: Asset | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (id: string, data: Partial<Asset>) => void
}

export function EditAssetDialog({ asset, open, onOpenChange, onUpdate }: EditAssetDialogProps) {
  if (!asset) return null

  const onSubmit = (data: Partial<Asset>) => {
    onUpdate(asset.id, data)
    onOpenChange(false)
    toast.success("Asset details updated")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Asset Information</DialogTitle>
        </DialogHeader>
        <AssetForm
          initialValues={asset}
          onSubmit={onSubmit}
          isEdit={true}
        />
      </DialogContent>
    </Dialog>
  )
}
