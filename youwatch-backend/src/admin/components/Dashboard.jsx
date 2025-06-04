import { Box, H2, Text } from "@adminjs/design-system";

const Dashboard = () => {
  console.log("✅ Custom Dashboard loaded");
  return (
    <Box variant="grey">
      <H2>👋 Welcome to YouWatch Admin</H2>
      <Text>Manage your content here.</Text>
    </Box>
  );
};

export default Dashboard;
