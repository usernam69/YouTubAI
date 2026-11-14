import { Routes, Route, useParams, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Channel, { Subscriptions } from "./pages/Channel";
import Shorts from "./pages/Shorts";
import Feature from "./pages/Feature";
import FeaturesLab from "./pages/FeaturesLab";

function FeatureRoute() {
  const { id } = useParams();
  return <Feature id={id!} title={id!} />;
}

function ChannelRoute() {
  const { slug } = useParams();
  return <Channel slug={slug!} />;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch/:slug" element={<Watch />} />
        <Route path="/search" element={<Search />} />
        <Route path="/shorts" element={<Shorts />} />
        <Route path="/subs" element={<Subscriptions />} />
        <Route path="/channel/:slug" element={<ChannelRoute />} />
        <Route path="/history" element={<Library kind="history" />} />
        <Route path="/playlists" element={<Library kind="playlists" />} />
        <Route path="/watchlater" element={<Library kind="watchlater" />} />
        <Route path="/liked" element={<Library kind="liked" />} />
        <Route path="/features" element={<FeaturesLab />} />
        <Route path="/f/:id" element={<FeatureRoute />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}