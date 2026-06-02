const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/driving_planer/src/views/AboutView.vue');
let content = fs.readFileSync(filePath, 'utf-8');

// Add ref, onMounted to imports
content = content.replace(
  "import { computed } from 'vue'",
  "import { computed, ref, onMounted } from 'vue'"
);

// Add schoolCount ref and fetch logic
const fetchLogic = `
const schoolCount = ref('60+')

onMounted(async () => {
  try {
    const response = await fetch(\`\${import.meta.env.VITE_API_URL}/api/schools/count\`)
    const data = await response.json()
    if (data && data.count !== undefined) {
      schoolCount.value = String(data.count)
    }
  } catch (error) {
    console.error('Failed to fetch school count', error)
  }
})
`;

content = content.replace(
  "const router = useRouter()",
  "const router = useRouter()\n" + fetchLogic
);

// Update InfoStatsCard title
content = content.replace(
  /:title="'60\+'"/g,
  ':title="schoolCount"'
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('File updated successfully!');
