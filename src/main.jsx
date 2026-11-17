import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LangProvider } from './lib/i18n'
import { ContentProvider } from './lib/content'
import { ConsultProvider } from './components/ui'
import Layout from './components/Layout'
import Home from './home/Home'
import { About, Services, ServiceDetail, Clients, Insights, Post, Media, Invest, Careers, Contact, Library, Board, NotFound } from './pages/pages'
import './styles/site.css'

const Admin = lazy(() => import('./admin/AdminApp'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LangProvider>
        <ContentProvider>
          <ConsultProvider>
            <Routes>
              <Route path="/admin/*" element={<Suspense fallback={<div className="page-loading" />}><Admin /></Suspense>} />
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/insights/:slug" element={<Post />} />
                <Route path="/media" element={<Media />} />
                <Route path="/invest-in-egypt" element={<Invest />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/library" element={<Library />} />
                <Route path="/board" element={<Board />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </ConsultProvider>
        </ContentProvider>
      </LangProvider>
    </BrowserRouter>
  </StrictMode>,
)
