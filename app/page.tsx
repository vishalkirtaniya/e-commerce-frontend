'use client';
import { useState, useEffect } from 'react';
 import Header from'@/components/Header';
 import Footer from'@/components/Footer';
 import HeroSection from'@/components/HeroSection';
 import ProductCategories from'@/components/ProductCategories';
 import NewArrivals from'@/components/NewArrivals';
 import TopSelling from'@/components/TopSelling';
 import CustomerReviews from'@/components/CustomerReviews';

interface Product {
  id: number
  name: string
  price: string
  originalPrice?: string
  discount?: string
  rating: number
  image: string
}

interface Customer {
  id: number
  name: string
  rating: number
  comment: string
  verified: boolean
}

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [topSellingProducts, setTopSellingProducts] = useState<Product[]>([])
  const [customerReviews, setCustomerReviews] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHomePageData()
  }, [])

  const loadHomePageData = async (): Promise<void> => {
    try {
      // Simulate API calls
      setTimeout(() => {
        setNewArrivals([
          {
            id: 1,
            name: 'T-shirt with tape details',
            price: '$120',
            rating: 4.5,
            image: '/images/img_image_7.png'
          },
          {
            id: 2,
            name: 'Skinny fit jeans',
            price: '$240',
            originalPrice: '$260',
            discount: '-20%',
            rating: 3.5,
            image: '/images/img_image_8.png'
          },
          {
            id: 3,
            name: 'Checkered shirt',
            price: '$180',
            rating: 4.5,
            image: '/images/img_image_9.png'
          },
          {
            id: 4,
            name: 'Sleeve striped T-shirt',
            price: '$130',
            originalPrice: '$160',
            discount: '-30%',
            rating: 4.5,
            image: '/images/img_image_10.png'
          }
        ])

        setTopSellingProducts([
          {
            id: 1,
            name: 'Vertical striped shirt',
            price: '$212',
            originalPrice: '$232',
            discount: '-20%',
            rating: 5.0,
            image: '/images/image_7.png'
          },
          {
            id: 2,
            name: 'Courage graphic T-shirt',
            price: '$145',
            rating: 4.0,
            image: '/images/image_8.png'
          },
          {
            id: 3,
            name: 'Loose fit bermuda shorts',
            price: '$80',
            rating: 3.0,
            image: '/images/image_9.png'
          },
          {
            id: 4,
            name: 'Faded skinny jeans',
            price: '$210',
            rating: 4.5,
            image: '/images/image_10.png'
          }
        ])

        setCustomerReviews([
          {
            id: 1,
            name: 'Sarah M.',
            rating: 5,
            comment: 'I am blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I have bought has exceeded my expectations.',
            verified: true
          },
          {
            id: 2,
            name: 'Alex K.',
            rating: 5,
            comment: 'Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.',
            verified: true
          },
          {
            id: 3,
            name: 'James L.',
            rating: 5,
            comment: 'As someone who is always on the lookout for unique fashion pieces, I am thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.',
            verified: true
          }
        ])

        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to load homepage data:', error)
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProductCategories />
        <NewArrivals products={newArrivals} loading={loading} />
        <TopSelling products={topSellingProducts} loading={loading} />
        <CustomerReviews reviews={customerReviews} loading={loading} />
      </main>
      <Footer />
    </>
  )
}