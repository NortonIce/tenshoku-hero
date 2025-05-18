import { NextResponse } from "next/server";
import { addResume, getResumes } from "@/app/services/resumesService";
import type { Resume } from "@/types/Resume";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, fileId, link } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const resume: Resume = {
      title,
      fileId: fileId || undefined,
      link: link || undefined,
      userId: session.user.id, // This should be replaced with actual user ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const createdResume = await addResume(resume, session.user.id); // This should be replaced with actual user ID
    return NextResponse.json(createdResume);
  } catch (error) {
    console.error("Error creating resume:", error);
    return NextResponse.json(
      { error: "Failed to create resume" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const resumes = await getResumes(session.user.id); // This should be replaced with actual user ID
    return NextResponse.json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}
