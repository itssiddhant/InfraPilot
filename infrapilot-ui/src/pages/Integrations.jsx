import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Modal from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slack, BarChart2 } from "lucide-react";

const integrationsList = [
  {
    name: "Slack",
    icon: <Slack className="text-[#4A154B]" />,
    description: "Receive InfraPilot alerts and notifications directly in your Slack channels.",
    fields: [
      { name: "webhookUrl", label: "Incoming Webhook URL", type: "text", placeholder: "https://hooks.slack.com/services/..." },
      { name: "channel", label: "Default Channel", type: "text", placeholder: "#general" },
    ]
  },
  {
    name: "Grafana",
    icon: <BarChart2 className="text-[#F46800]" />,
    description: "Overlay RCA events on your Grafana dashboards to correlate with metrics.",
    fields: [
      { name: "apiUrl", label: "Grafana API URL", type: "text", placeholder: "https://my-grafana.com" },
      { name: "apiKey", label: "API Key (with Admin role)", type: "password", placeholder: "glc_... or glsa_..." },
    ]
  }
];

export default function Integrations() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const handleConfigureClick = (integration) => {
    setSelectedIntegration(integration);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedIntegration(null);
  };

  const handleSaveChanges = () => {
    alert(`(Simulated) Settings for ${selectedIntegration.name} saved!`);
    handleModalClose();
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-100">Integrations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {integrationsList.map((integration) => (
          <Card key={integration.name} className="bg-gray-900/80 backdrop-blur-md shadow-lg rounded-xl border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                {integration.icon}
                {integration.name}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {integration.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => handleConfigureClick(integration)}>
                Configure
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedIntegration && (
        <Modal 
          open={isModalOpen} 
          onClose={handleModalClose} 
          title={`Configure ${selectedIntegration.name}`}
        >
          <div className="space-y-4">
            {selectedIntegration.fields.map(field => (
              <div key={field.name} className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor={field.name} className="text-gray-300">{field.label}</Label>
                <Input type={field.type} id={field.name} placeholder={field.placeholder} className="bg-gray-800 border-gray-600 text-white" />
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={handleModalClose}>Cancel</Button>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
} 