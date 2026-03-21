import re

with open("src/App.jsx", "r") as f:
    content = f.read()

# Add import after lucide-react
old = "from 'lucide-react'\n\n// Animated Counter"
new = "from 'lucide-react'\n\nimport StaffScreen from './components/StaffManagement'\n\n// Animated Counter"

content = content.replace(old, new)

# Add staff screen to routing
old_route = "{activeItem === 'transport' && <TransportScreen />}\n        </main>\n      </div>\n    </div>\n  )"
new_route = "{activeItem === 'transport' && <TransportScreen />}\n          {activeItem === 'staff' && <StaffScreen />}\n        </main>\n      </div>\n    </div>\n  )"

content = content.replace(old_route, new_route)

with open("src/App.jsx", "w") as f:
    f.write(content)

print("Done")

