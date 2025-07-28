import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import ToolsGrid from '@/components/ToolsGrid';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <div id="tools">
        <ToolsGrid />
      </div>
    </Layout>
  );
};

export default Index;
