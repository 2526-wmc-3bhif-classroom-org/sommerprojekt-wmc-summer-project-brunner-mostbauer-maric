<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import CommunityIcon from './icons/IconCommunity.vue'
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Info</template>
    Learn all the necessary information for completing getting your driving license.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Community</template>

    Perfect place for you if you ...
    <ul>

      <li>
        ... are interested in Discussions with other people getting their driving license.
      </li>
      <li>
        ... want to rate and share your opinions about driving schools.
      </li>
      <li>
        ... have questions about the process not mentioned in the guide.
      </li>
    </ul>
  </WelcomeItem>

</template>
