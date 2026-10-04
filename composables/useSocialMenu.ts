import { ref } from 'vue';

export function useSocialMenu() {
  const socialLinks = ref([
    {
      url: 'https://twitter.com/webzuerich',
      icon: 'twitter',
      text: 'Twitter',
      desc: 'Follow us for updates',
      color: '#1DA1F2'
    },
    {
      url: 'https://github.com/webzuri/webzuri.ch',
      icon: 'github',
      text: 'GitHub',
      desc: 'Contribute to our website',
      color: '#333'
    },
    {
      url: 'https://webzurich.slack.com',
      icon: 'slack',
      text: 'Slack',
      desc: 'Join our community',
      color: '#4A154B'
    }
  ]);
  
  return {
    socialLinks
  };
} 