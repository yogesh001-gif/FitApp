import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { tryConnectToDatabase } from '../../../../lib/db';
import { configureCloudinary } from '../../../../lib/cloudinary';
import { ProgressPhotoModel, UserModel, type UserRecord } from '../../../../lib/models';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const angle = String(formData.get('angle') ?? 'front');
  const file = formData.get('photo');
  if (!(file instanceof File)) {
    return Response.json({ error: 'Photo file is required' }, { status: 400 });
  }

  const dbStatus = await tryConnectToDatabase();
  if (!dbStatus.ok) return Response.json({ error: 'Database unavailable', details: dbStatus.error }, { status: 503 });
  const user = (await UserModel.findOne({ clerkUserId: userId }).lean()) as UserRecord | null;
  if (!user) return Response.json({ error: 'User profile not found' }, { status: 404 });

  const cloudinary = configureCloudinary();
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const upload = await cloudinary.uploader.upload(`data:${file.type};base64,${base64}`, { folder: 'fitmitra/progress' });

  const entry = await ProgressPhotoModel.create({
    userId: user._id,
    angle,
    url: upload.secure_url,
    publicId: upload.public_id,
    caption: file.name
  });

  return Response.json({ photo: entry });
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const dbStatus = await tryConnectToDatabase();
  if (!dbStatus.ok) return Response.json({ error: 'Database unavailable', details: dbStatus.error }, { status: 503 });

  const user = (await UserModel.findOne({ clerkUserId: userId }).lean()) as UserRecord | null;
  if (!user) return Response.json({ error: 'User profile not found' }, { status: 404 });

  const photos = await ProgressPhotoModel.find({ userId: user._id })
    .sort({ takenAt: -1 })
    .lean();

  return Response.json({ photos });
}
