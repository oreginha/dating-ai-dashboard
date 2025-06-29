import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { DiscoveryPipelineDashboard } from './pages/DiscoveryPipeline';
import { ConversationManagerDashboard } from './pages/ConversationManager';
import { OpportunityDetectorDashboard } from './pages/OpportunityDetector';
import { AutoResponseSystemDashboard } from './pages/AutoResponseSystem';
import { NotificationContainer } from './components/Notifications';
import { useWebSocket } from './hooks/useWebSocket';
import './index.css';

function App() {
  // Initialize WebSocket connection
  useWebSocket();

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/discovery" element={<DiscoveryPipelineDashboard />} />
          <Route path="/conversations" element={<ConversationManagerDashboard />} />
          <Route path="/opportunities" element={<OpportunityDetectorDashboard />} />
          <Route path="/auto-response" element={<AutoResponseSystemDashboard />} />
        </Routes>
      </Layout>
      <NotificationContainer />
    </Router>
  );
}

export default App;
