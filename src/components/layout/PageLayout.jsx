import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import './PageLayout.css';

const PageLayout = () => {
  return (
    <div className="page-layout">
      {/* Topbar - Fixed at top with integrated navigation */}
      <Topbar />

      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PageLayout;
