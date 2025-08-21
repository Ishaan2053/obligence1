"use client";

import { useState } from "react";
import type React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	User,
	Mail,
	Lock,
	Shield,
	Trash2,
	Settings,
    AlertTriangleIcon,
} from "lucide-react";

type TabKey = "profile" | "connected" | "danger";

export default function SettingsDialog() {
	const [open, setOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<TabKey>("profile");

	// Profile state
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");

	// Password state
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleSaveProfile = (e: React.FormEvent) => {
		e.preventDefault();
		// Replace with API call
		console.log("Save profile", { username, email });
		setOpen(false);
	};

	const handleChangePassword = (e: React.FormEvent) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			alert("New password and confirmation do not match.");
			return;
		}
		// Replace with API call
		console.log("Change password", { currentPassword, newPassword });
		setOpen(false);
	};

	const handleDeleteAccount = (e: React.FormEvent) => {
		e.preventDefault();
		// Replace with API call + confirmation flow
		const ok = confirm(
			"This will permanently delete your account and all associated data. Are you sure?"
		);
		if (!ok) return;
		console.log("Delete account");
		setOpen(false);
	};

	const SidebarItem = ({
		tab,
		label,
		icon: Icon,
	}: {
		tab: TabKey;
		label: string;
		icon: React.ComponentType<any>;
	}) => (
		<SidebarMenuItem>
			<SidebarMenuButton
				isActive={activeTab === tab}
				onClick={() => setActiveTab(tab)}
				className="flex items-center rounded-2xl"
			>
				<Icon className="h-4 w-4" />
				<span>{label}</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<Settings className="mr-2 h-4 w-4" />
					Open Settings
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-5xl p-0 overflow-hidden rounded-2xl">
				<DialogHeader className="px-6 pt-6 pb-2 border-b">
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>
						Manage your account details and preferences.
					</DialogDescription>
				</DialogHeader>

				<div className="flex h-[70vh] w-full">
					<SidebarProvider defaultOpen={true}>
						{/* Left rail */}
						<div className="border-r w-64 shrink-0">
							<Sidebar collapsible="none" className="h-full">
								<SidebarContent className="p-2">
									<SidebarMenu>
										{/* Real tabs */}
										<SidebarItem tab="profile" label="Profile" icon={User} />
										<SidebarItem tab="connected" label="Connected Accounts" icon={Shield} />
										<SidebarItem tab="danger" label="Danger Zone" icon={Trash2} />

									</SidebarMenu>
								</SidebarContent>
							</Sidebar>
						</div>

						{/* Right content */}
						<div className="flex-1 overflow-auto p-6 space-y-8">
							{activeTab === "profile" && (
								<section className="space-y-6">
									<header>
										<h3 className="text-base font-semibold">Profile</h3>
										<p className="text-sm text-muted-foreground">
											Update your public profile information.
										</p>
									</header>
									<form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
										<div className="grid gap-2">
											<Label htmlFor="username">Username</Label>
											<Input
												id="username"
												placeholder="johndoe"
												value={username}
												onChange={(e) => setUsername(e.target.value)}
												required
											/>
										</div>
										<div className="grid gap-2">
											<Label htmlFor="email">Email</Label>
											<Input
												id="email"
												type="email"
												placeholder="john@example.com"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												required
											/>
										</div>
										<DialogFooter>
											<Button type="submit">Save changes</Button>
										</DialogFooter>
									</form>
								</section>
							)}

							{activeTab === "connected" && (
								<section className="space-y-6">
									<header>
										<h3 className="text-base font-semibold">Connected Accounts</h3>
										<p className="text-sm text-muted-foreground">
											Manage your connected accounts and their permissions.
										</p>
									</header>
									<form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
										<div className="grid gap-2">
											<Label htmlFor="currentPassword">Current password</Label>
											<Input
												id="currentPassword"
												type="password"
												value={currentPassword}
												onChange={(e) => setCurrentPassword(e.target.value)}
												required
											/>
										</div>
										<div className="grid gap-2">
											<Label htmlFor="newPassword">New password</Label>
											<Input
												id="newPassword"
												type="password"
												value={newPassword}
												onChange={(e) => setNewPassword(e.target.value)}
												required
											/>
										</div>
										<div className="grid gap-2">
											<Label htmlFor="confirmPassword">Confirm new password</Label>
											<Input
												id="confirmPassword"
												type="password"
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
												required
											/>
										</div>
										<DialogFooter>
											<Button type="submit">Update password</Button>
										</DialogFooter>
									</form>
								</section>
							)}

							{activeTab === "danger" && (
								<section className="space-y-6">
									<header>
										<h3 className="text-base font-semibold">Danger Zone</h3>
										<p className="text-sm text-muted-foreground">
											Permanently delete your account and all associated data.
										</p>
									</header>
									<form onSubmit={handleDeleteAccount} className="space-y-4 max-w-md">
										<div className="rounded-2xl border p-4 bg-destructive/5">
											<p className="flex items-center gap-2 text-sm ">
												<AlertTriangleIcon /> This action cannot be undone. Please proceed with caution.
											</p>
										</div>
										<DialogFooter>
											<Button type="submit" variant="destructive">
												<Trash2 className="mr-2 h-4 w-4" /> Delete account
											</Button>
										</DialogFooter>
									</form>
								</section>
							)}

						

							
						</div>
					</SidebarProvider>
				</div>
			</DialogContent>
		</Dialog>
	);
}

