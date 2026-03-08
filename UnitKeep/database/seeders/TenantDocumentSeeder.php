<?php

namespace Database\Seeders;

use App\Models\TenantDocument;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class TenantDocumentSeeder extends Seeder
{
    /**
     * Seed the database with tenant documents sourced from tracked project files.
     */
    public function run(): void
    {
        foreach (config('tenant-documents', []) as $slug => $document) {
            $sourcePath = $this->resolveSourcePath($document['source'], $document['file_name']);

            if ($sourcePath === null) {
                continue;
            }

            $content = file_get_contents($sourcePath);

            if ($content === false) {
                continue;
            }

            TenantDocument::updateOrCreate(
                ['slug' => $slug],
                [
                    'title' => $document['title'],
                    'file_name' => $document['file_name'],
                    'mime_type' => $document['mime_type'],
                    'content_base64' => base64_encode($content),
                    'file_size' => strlen($content),
                ]
            );
        }
    }

    /**
     * Resolve the best available source path for a document.
     */
    private function resolveSourcePath(string $repoSource, string $fileName): ?string
    {
        $candidatePaths = [
            base_path($repoSource),
            Storage::disk('public')->path('documents/'.$fileName),
        ];

        foreach ($candidatePaths as $candidatePath) {
            if (is_file($candidatePath)) {
                return $candidatePath;
            }
        }

        return null;
    }
}
