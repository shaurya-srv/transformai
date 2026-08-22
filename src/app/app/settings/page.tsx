"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/Toast";
import {
  User,
  Shield,
  Brain,
  Bell,
  Building,
  Key,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Globe,
  Palette,
} from "lucide-react";

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "ai", label: "AI Preferences", icon: Brain },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "organization", label: "Organization", icon: Building },
  { id: "api", label: "API / Integrations", icon: Key },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  // Profile state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [organization, setOrganization] = useState(user?.organization || "");

  // Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // AI preferences
  const [defaultLanguage, setDefaultLanguage] = useState("English");
  const [defaultTone, setDefaultTone] = useState("Professional");
  const [defaultAudience, setDefaultAudience] = useState("General");
  const [defaultDetail, setDefaultDetail] = useState("Standard");

  // Notifications
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [transformNotifs, setTransformNotifs] = useState(true);
  const [marketingNotifs, setMarketingNotifs] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsSaving(false);
    toast("Settings saved successfully");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account, preferences, and integrations.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Section nav */}
        <div className="lg:w-48 shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  activeSection === s.id
                    ? "bg-blue-50 text-blue-700 border border-blue-100"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                <s.icon className="w-4 h-4" />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Profile */}
          {activeSection === "profile" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-base font-bold text-gray-900 mb-6">Profile</h2>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <span className="text-2xl font-bold text-white">
                      {name.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <button className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                      Change Photo
                    </button>
                    <p className="text-[10px] text-gray-400 mt-1">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/25 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>
          )}

          {/* Security */}
          {activeSection === "security" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-base font-bold text-gray-900 mb-6">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPw ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPw ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleSave}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/25"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-base font-bold text-gray-900 mb-4">Active Sessions</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div>
                      <p className="text-sm text-gray-900 font-medium">Current Session</p>
                      <p className="text-[10px] text-gray-400">Chrome · Just now</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                      Active
                    </span>
                  </div>
                </div>
                <button className="mt-4 text-xs text-red-500 hover:text-red-600 transition-colors">
                  Logout all other devices
                </button>
              </div>
            </div>
          )}

          {/* AI Preferences */}
          {activeSection === "ai" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-base font-bold text-gray-900 mb-6">AI Preferences</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <Globe className="w-3.5 h-3.5 inline mr-1" />
                      Default Language
                    </label>
                    <select
                      value={defaultLanguage}
                      onChange={(e) => setDefaultLanguage(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                      {["English", "Hindi", "Spanish", "French", "German"].map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <Palette className="w-3.5 h-3.5 inline mr-1" />
                      Default Tone
                    </label>
                    <select
                      value={defaultTone}
                      onChange={(e) => setDefaultTone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                      {["Professional", "Urgent", "Authoritative", "Conversational", "Formal"].map(
                        (t) => (
                          <option key={t} value={t}>{t}</option>
                        )
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Default Audience
                    </label>
                    <select
                      value={defaultAudience}
                      onChange={(e) => setDefaultAudience(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                      {["General", "Executive", "Technical", "Public", "Media"].map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Default Detail Level
                    </label>
                    <select
                      value={defaultDetail}
                      onChange={(e) => setDefaultDetail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                      {["Brief", "Standard", "Detailed"].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/25 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Preferences
              </button>
            </div>
          )}

          {/* Notifications */}
          {activeSection === "notifications" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-base font-bold text-gray-900 mb-6">Notifications</h2>
                <div className="space-y-4">
                  {[
                    {
                      label: "Email notifications",
                      desc: "Receive email updates about your transformations.",
                      checked: emailNotifs,
                      onChange: setEmailNotifs,
                    },
                    {
                      label: "Transformation complete",
                      desc: "Get notified when your AI outputs are ready.",
                      checked: transformNotifs,
                      onChange: setTransformNotifs,
                    },
                    {
                      label: "Product updates",
                      desc: "Learn about new features and improvements.",
                      checked: marketingNotifs,
                      onChange: setMarketingNotifs,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => item.onChange(!item.checked)}
                        className={`relative w-10 h-6 rounded-full transition-colors ${
                          item.checked ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
                            item.checked ? "left-5" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Organization */}
          {activeSection === "organization" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-base font-bold text-gray-900 mb-6">Organization</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.organization || ""}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Team Members
                    </label>
                    <p className="text-xs text-gray-400">
                      Team collaboration features coming soon.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API */}
          {activeSection === "api" && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-base font-bold text-gray-900 mb-6">API / Integrations</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="text-sm font-medium text-gray-900 mb-1">API Access</p>
                    <p className="text-[11px] text-gray-400">
                      Programmatic access to TransformAI is coming soon. You&apos;ll be able to
                      integrate transformations into your workflows via REST API.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="text-sm font-medium text-gray-900 mb-1">Webhooks</p>
                    <p className="text-[11px] text-gray-400">
                      Receive real-time notifications when transformations complete. Coming in
                      the next release.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
