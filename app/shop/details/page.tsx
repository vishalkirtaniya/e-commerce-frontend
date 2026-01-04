import { Metadata } from 'next';
 import ProductDetailPage from'./ui/DetailsPage';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'One Life Graphic T-shirt - Premium Design | SHOP.CO',
  description: 'Discover the One Life Graphic T-shirt crafted from soft and breathable fabric. Perfect for any occasion with superior comfort and style. Available in multiple colors and sizes.',
  keywords: 'graphic t-shirt, one life design, premium t-shirt, casual wear, soft fabric, breathable clothing, men fashion, designer t-shirt',
  
  openGraph: {
    title: 'One Life Graphic T-shirt - Premium Design | SHOP.CO',
    description: 'Discover the One Life Graphic T-shirt crafted from soft and breathable fabric. Perfect for any occasion with superior comfort and style. Available in multiple colors and sizes.',
  }
}

export default function Page() {
  return <>
  
  <ProductDetailPage />
  <Footer/>
  </>
}