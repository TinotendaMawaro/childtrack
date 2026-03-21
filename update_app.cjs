const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');
c = c.replace(/from 'lucide-react'/, "from 'lucide-react'\n\nimport StaffScreen from './components/StaffManagement'");
c = c.replace(/\{activeItem === 'transport' && <TransportScreen \/\>\}/, "{activeItem === 'transport' && <TransportScreen />}\n          {activeItem === 'staff' && <StaffScreen />}");
fs.writeFileSync('src/App.jsx', c);
console.log("Done");

