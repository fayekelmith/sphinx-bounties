"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema, type UpdateProfileInput } from "@/validations/user.schema";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateProfile } from "@/hooks/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

function getInitials(username: string, alias?: string | null): string {
  const name = alias || username;
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: user?.username || "",
      alias: user?.alias || "",
      description: user?.description || "",
      avatarUrl: user?.avatarUrl || "",
      githubUsername: user?.githubUsername || "",
      twitterUsername: user?.twitterUsername || "",
    },
  });

  const watchedFields = watch();

  const onSubmit = (data: UpdateProfileInput) => {
    if (!user?.pubkey) return;

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value.toString());
      }
    });

    updateProfileMutation.mutate({ pubkey: user.pubkey, formData });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const previewAlias = watchedFields.alias || user.alias;
  const previewUsername = watchedFields.username || user.username;
  const previewDescription = watchedFields.description || user.description;
  const previewAvatarUrl = watchedFields.avatarUrl || user.avatarUrl;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Profile Settings</h2>
        <p className="text-sm text-muted-foreground">Update your profile information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Your public profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" {...register("username")} placeholder="johndoe" />
                  {errors.username && (
                    <p className="text-sm text-accent-600">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alias">Display Name</Label>
                  <Input id="alias" {...register("alias")} placeholder="John Doe" />
                  {errors.alias && (
                    <p className="text-sm text-accent-600">{errors.alias.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Bio</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-accent-600">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input
                    id="avatarUrl"
                    {...register("avatarUrl")}
                    placeholder="https://example.com/avatar.jpg"
                    type="url"
                  />
                  {errors.avatarUrl && (
                    <p className="text-sm text-accent-600">{errors.avatarUrl.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Connect your social media accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="githubUsername">GitHub Username</Label>
                  <Input
                    id="githubUsername"
                    {...register("githubUsername")}
                    placeholder="johndoe"
                  />
                  {errors.githubUsername && (
                    <p className="text-sm text-accent-600">{errors.githubUsername.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitterUsername">Twitter Username</Label>
                  <Input
                    id="twitterUsername"
                    {...register("twitterUsername")}
                    placeholder="johndoe"
                  />
                  {errors.twitterUsername && (
                    <p className="text-sm text-accent-600">{errors.twitterUsername.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="submit" disabled={!isDirty || updateProfileMutation.isPending}>
                {updateProfileMutation.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
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

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>How others see your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center space-y-3">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={previewAvatarUrl || undefined}
                    alt={previewAlias || previewUsername}
                  />
                  <AvatarFallback className="bg-primary-100 text-primary-700 text-2xl">
                    {getInitials(previewUsername, previewAlias)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="text-lg font-semibold">{previewAlias || previewUsername}</h3>
                  <p className="text-sm text-muted-foreground">@{previewUsername}</p>
                </div>

                {previewDescription && (
                  <>
                    <Separator />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {previewDescription}
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
