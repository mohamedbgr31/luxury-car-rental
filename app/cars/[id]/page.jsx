
import CarDetailsClient from './client-page';

export async function generateStaticParams() {
  try {
    // In a real build environment, you might fetch this from an API or database
    // For now we return an empty array or know values.
    return [{ id: '1' }];
  } catch (e) {
    console.error("Error generating static params", e);
    return [];
  }
}

export default async function CarDetailsPage({ params }) {
  // Await params to avoid accessing it synchronously which is deprecated
  const { id } = await params;
  return <CarDetailsClient id={id} />;
}