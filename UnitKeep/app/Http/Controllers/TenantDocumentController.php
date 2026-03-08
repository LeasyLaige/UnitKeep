<?php

namespace App\Http\Controllers;

use App\Models\TenantDocument;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;

class TenantDocumentController extends Controller
{
    /**
     * Download a tenant document from the database, with file fallbacks for existing installs.
     */
    public function download(string $document): Response|BinaryFileResponse
    {
        $documentConfig = config("tenant-documents.{$document}");

        abort_unless(is_array($documentConfig), 404);

        $databaseDocument = TenantDocument::query()
            ->where('slug', $document)
            ->first();

        if ($databaseDocument !== null) {
            $content = base64_decode($databaseDocument->content_base64, true);

            abort_unless($content !== false, 404);

            return response($content, 200, [
                'Content-Type' => $databaseDocument->mime_type,
                'Content-Disposition' => 'attachment; filename="'.$databaseDocument->file_name.'"',
            ]);
        }

        $repoSourcePath = base_path($documentConfig['source']);

        if (is_file($repoSourcePath)) {
            return response()->download($repoSourcePath, $documentConfig['file_name']);
        }

        $legacyStoragePath = 'documents/'.$documentConfig['file_name'];

        if (Storage::disk('public')->exists($legacyStoragePath)) {
            return response()->download(
                Storage::disk('public')->path($legacyStoragePath),
                $documentConfig['file_name']
            );
        }

        abort(404, 'The requested document is not available.');
    }
}
