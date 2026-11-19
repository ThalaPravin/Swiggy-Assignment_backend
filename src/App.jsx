import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DinerMobileView from './components/DinerMobileView';
import WorkflowStudioView from './components/WorkflowStudioView';
import PitchDeckView from './components/PitchDeckView';
import ArchitectureDiagramsView from './components/ArchitectureDiagramsView';
import TestRunnerView from './components/TestRunnerView';
import DeployModal from './components/DeployModal';
import CustomUploadModal from './components/CustomUploadModal';
import CommandPaletteModal from './components/CommandPaletteModal';
import BackendInspectorModal from './components/BackendInspectorModal';
import { SAMPLE_BILLS } from './data/sampleBills';
import audioService from './utils/audioService';

export default function App() {
  const [activeTab, setActiveTab] = useState('diner');
  const [bills, setBills] = useState(SAMPLE_BILLS);
  const [selectedBillId, setSelectedBillId] = useState(SAMPLE_BILLS[0].id);
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isCustomUploadOpen, setIsCustomUploadOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isBackendInspectorOpen, setIsBackendInspectorOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => audioService.getIsMuted());
  const [notification, setNotification] = useState(null);

  // Sync mute state with AudioService
  useEffect(() => {
    const unsubscribe = audioService.subscribe((muted) => setIsMuted(muted));
    return () => unsubscribe();
  }, []);

  // Ticket #C2-4: Global Keyboard Shortcuts (Cmd+K / Ctrl+K and 1-5 navigation)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Toggle Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        audioService.playTap();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      // Check if user is typing in an input or textarea
      const targetTag = e.target.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || e.target.isContentEditable) {
        return;
      }

      // 1-5 Number keys navigation
      if (e.key === '1') { setActiveTab('diner'); audioService.playTap(); }
      else if (e.key === '2') { setActiveTab('workflow'); audioService.playTap(); }
      else if (e.key === '3') { setActiveTab('diagrams'); audioService.playTap(); }
      else if (e.key === '4') { setActiveTab('tests'); audioService.playTap(); }
      else if (e.key === '5') { setActiveTab('pitch'); audioService.playTap(); }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleNotifyCatalogSync = (bill) => {
    setNotification({
      title: "Docket Dispatched to Catalog Flywheel",
      message: `Scanned check for ${bill.restaurantName} queued for tonight's 02:00 AM Cron.`
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddCustomBill = (newBill) => {
    setBills(prev => [newBill, ...prev]);
    setSelectedBillId(newBill.id);
    setNotification({
      title: "Custom Check Interrogated Successfully",
      message: `Extracted ${newBill.items.length} line items from ${newBill.restaurantName}.`
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleTriggerAction = (actionId) => {
    if (actionId === 'toggle_mute') {
      audioService.toggleMute();
    } else if (actionId === 'run_tests') {
      setActiveTab('tests');
    } else if (actionId === 'trigger_cron') {
      setActiveTab('workflow');
    } else if (actionId === 'launch_fairsplit' || actionId === 'download_voucher' || actionId === 'toggle_ocr') {
      setActiveTab('diner');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-[#ecebe6] flex flex-col font-sans selection:bg-[#f2b544] selection:text-[#141008]">
      
      {/* Toast Notification (Noir Tungsten) */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#131315] text-[#ecebe6] p-4 rounded-xl shadow-lampGlow border border-[#f2b544]/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#f2b544]/20 text-[#f2b544] flex items-center justify-center font-serif text-lg font-bold">
            ✦
          </div>
          <div className="text-xs font-mono">
            <div className="font-serif text-sm font-bold text-[#ecebe6]">{notification.title}</div>
            <div className="text-[#8d8c86]">{notification.message}</div>
          </div>
        </div>
      )}

      {/* Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenBackendInspector={() => setIsBackendInspectorOpen(true)}
        isMuted={isMuted}
        onToggleMute={() => audioService.toggleMute()}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'diner' && (
          <DinerMobileView 
            bills={bills}
            selectedBillId={selectedBillId}
            setSelectedBillId={setSelectedBillId}
            isMobileFrame={isMobileFrame}
            onNotifyCatalogSync={handleNotifyCatalogSync}
            onOpenCustomUpload={() => setIsCustomUploadOpen(true)}
          />
        )}

        {activeTab === 'workflow' && (
          <WorkflowStudioView 
            bills={bills}
          />
        )}

        {activeTab === 'diagrams' && (
          <ArchitectureDiagramsView />
        )}

        {activeTab === 'tests' && (
          <TestRunnerView />
        )}

        {activeTab === 'pitch' && (
          <PitchDeckView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#26262a] bg-[#0b0b0c] py-6 text-xs text-[#8d8c86] font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm text-[#ecebe6]">Swiggy Dineout Sentinel</span>
            <span>•</span>
            <span>Product Innovation with GenAI Case Prototype</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Bangalore Head Office</span>
            <span>•</span>
            <span className="text-[#f2b544] font-medium">100% Operational Prototype</span>
          </div>
        </div>
      </footer>

      {/* Deploy Instructions Modal */}
      <DeployModal 
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />

      {/* Custom Upload Modal */}
      <CustomUploadModal
        isOpen={isCustomUploadOpen}
        onClose={() => setIsCustomUploadOpen(false)}
        onAddCustomBill={handleAddCustomBill}
      />

      {/* Ticket #C2-4: Global Command Palette Spotlight Modal */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onSelectBill={(billId) => setSelectedBillId(billId)}
        onTriggerAction={handleTriggerAction}
        bills={bills}
        isMuted={isMuted}
      />

      {/* Live End-to-End Backend & Pipeline Inspector Modal */}
      <BackendInspectorModal
        isOpen={isBackendInspectorOpen}
        onClose={() => setIsBackendInspectorOpen(false)}
      />

    </div>
  );
}
