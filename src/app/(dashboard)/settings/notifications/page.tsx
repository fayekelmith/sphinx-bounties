"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateNotificationSettingsSchema,
  type UpdateNotificationSettingsInput,
} from "@/validations/user.schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, Smartphone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function NotificationSettingsPage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<UpdateNotificationSettingsInput>({
    resolver: zodResolver(updateNotificationSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      notifyOnBountyAssigned: true,
      notifyOnBountyCompleted: true,
      notifyOnPaymentReceived: true,
      notifyOnProofReviewed: true,
      notifyOnWorkspaceInvite: true,
      notifyOnMemberAdded: false,
    },
  });

  const onSubmit = async (_data: UpdateNotificationSettingsInput) => {
    if (!user?.pubkey) return;

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Notification settings updated successfully");
    } catch (_error) {
      toast.error("Failed to update notification settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Notification Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Channels
            </CardTitle>
            <CardDescription>Choose how you want to receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications" className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Controller
                name="emailNotifications"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="emailNotifications"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="pushNotifications" className="text-base flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications in your browser
                </p>
              </div>
              <Controller
                name="pushNotifications"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="pushNotifications"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bounty Notifications</CardTitle>
            <CardDescription>Get notified about bounty-related activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifyOnBountyAssigned" className="text-base">
                  Bounty Assigned
                </Label>
                <p className="text-sm text-muted-foreground">When you are assigned to a bounty</p>
              </div>
              <Controller
                name="notifyOnBountyAssigned"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="notifyOnBountyAssigned"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifyOnBountyCompleted" className="text-base">
                  Bounty Completed
                </Label>
                <p className="text-sm text-muted-foreground">
                  When a bounty you created is completed
                </p>
              </div>
              <Controller
                name="notifyOnBountyCompleted"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="notifyOnBountyCompleted"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifyOnProofReviewed" className="text-base">
                  Proof Reviewed
                </Label>
                <p className="text-sm text-muted-foreground">
                  When your proof of completion is reviewed
                </p>
              </div>
              <Controller
                name="notifyOnProofReviewed"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="notifyOnProofReviewed"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Notifications</CardTitle>
            <CardDescription>Lightning payment-related notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifyOnPaymentReceived" className="text-base">
                  Payment Received
                </Label>
                <p className="text-sm text-muted-foreground">When you receive a bounty payment</p>
              </div>
              <Controller
                name="notifyOnPaymentReceived"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="notifyOnPaymentReceived"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workspace Notifications</CardTitle>
            <CardDescription>Workspace and team activity notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifyOnWorkspaceInvite" className="text-base">
                  Workspace Invites
                </Label>
                <p className="text-sm text-muted-foreground">
                  When you are invited to join a workspace
                </p>
              </div>
              <Controller
                name="notifyOnWorkspaceInvite"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="notifyOnWorkspaceInvite"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifyOnMemberAdded" className="text-base">
                  Member Added
                </Label>
                <p className="text-sm text-muted-foreground">
                  When a new member joins your workspace
                </p>
              </div>
              <Controller
                name="notifyOnMemberAdded"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="notifyOnMemberAdded"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={!isDirty || isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!isDirty}
            onClick={() => window.location.reload()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
