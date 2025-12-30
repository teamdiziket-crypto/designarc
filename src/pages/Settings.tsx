import { useState } from 'react';
import {
  Building2,
  Image,
  FileSignature,
  Stamp,
  FileText,
  Mail,
  Save,
  RefreshCw,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AdminManagement } from '@/components/admin/AdminManagement';

export default function Settings() {
  const [settings, setSettings] = useState({
    instituteName: 'Design Arc Academy',
    logoUrl: '',
    signatureUrl: '',
    stampUrl: '',
    templateDocumentUrl: '',
    emailBodyTemplate: `Dear {{FullName}},

Congratulations on successfully completing the {{Course}} program at Design Arc Academy!

Please find your certificate attached to this email. You can also verify your certificate at our verification portal using your Certificate ID: {{CertificateID}}.

We wish you all the best in your future endeavors.

Best regards,
Design Arc Academy Team`,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('Settings saved successfully');
  };

  const handleSync = async () => {
    toast.success('Syncing with Google Sheet...');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success('Sync completed successfully');
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Configure certificate generation and system preferences.
            </p>
          </div>
          <Button onClick={handleSync} variant="outline" className="btn-glass">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Sheet
          </Button>
        </div>

        {/* Admin Management */}
        <AdminManagement />

        {/* Institute Settings */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Institute Information
          </h2>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="instituteName">Institute Name</Label>
              <Input
                id="instituteName"
                value={settings.instituteName}
                onChange={(e) =>
                  setSettings({ ...settings, instituteName: e.target.value })
                }
                className="input-glass"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logoUrl" className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-muted-foreground" />
                  Logo URL
                </Label>
                <Input
                  id="logoUrl"
                  value={settings.logoUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, logoUrl: e.target.value })
                  }
                  className="input-glass"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signatureUrl" className="flex items-center gap-2">
                  <FileSignature className="w-4 h-4 text-muted-foreground" />
                  Signature URL
                </Label>
                <Input
                  id="signatureUrl"
                  value={settings.signatureUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, signatureUrl: e.target.value })
                  }
                  className="input-glass"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stampUrl" className="flex items-center gap-2">
                  <Stamp className="w-4 h-4 text-muted-foreground" />
                  Stamp/Seal URL
                </Label>
                <Input
                  id="stampUrl"
                  value={settings.stampUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, stampUrl: e.target.value })
                  }
                  className="input-glass"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="templateUrl" className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Template Document URL
                </Label>
                <Input
                  id="templateUrl"
                  value={settings.templateDocumentUrl}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      templateDocumentUrl: e.target.value,
                    })
                  }
                  className="input-glass"
                  placeholder="https://docs.google.com/..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Email Template */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Email Template
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailTemplate">Certificate Email Body</Label>
              <Textarea
                id="emailTemplate"
                value={settings.emailBodyTemplate}
                onChange={(e) =>
                  setSettings({ ...settings, emailBodyTemplate: e.target.value })
                }
                className="input-glass min-h-[200px] font-mono text-sm"
              />
            </div>

            <div className="p-4 rounded-xl bg-muted/30">
              <p className="text-sm font-medium text-foreground mb-2">
                Available Placeholders:
              </p>
              <div className="flex flex-wrap gap-2">
                {['{{FullName}}', '{{Course}}', '{{IssueDate}}', '{{CertificateID}}'].map(
                  (placeholder) => (
                    <code
                      key={placeholder}
                      className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-mono"
                    >
                      {placeholder}
                    </code>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Google Apps Script API
          </h2>

          <div className="p-4 rounded-xl bg-muted/30">
            <p className="text-sm text-muted-foreground">
              The Google Apps Script API endpoint is configured server-side for
              security. Contact your administrator to update API settings.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary-gradient min-w-[140px]"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}