import fs from 'fs';
let c = fs.readFileSync('src/App.jsx', 'utf8');

// Add import for ClassesManagement
c = c.replace(/import StaffScreen from '.\/components\/StaffManagement'/, "import StaffScreen from './components/StaffManagement'\nimport ClassesScreen from './components/ClassesManagement'");

// Add classes screen to routing
c = c.replace(/\{activeItem === 'staff' && <StaffScreen \/\>\}/, "{activeItem === 'staff' && <StaffScreen />}\n          {activeItem === 'classes' && <ClassesScreen />}");

fs.writeFileSync('src/App.jsx', c);
console.log("Done");

