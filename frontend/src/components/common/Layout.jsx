import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const Layout = ({ children, title = 'Papel y Luna' }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={title} />
        <main className="flex-1 overflow-auto md:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
};
