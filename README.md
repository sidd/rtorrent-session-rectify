# rtorrent-session-rectify

A basic utility for updating `~/.rtorrent.session` files. This utility finds all `.rtorrent.session/*.rtorrent` files, and updates their hard-coded directories.

The `directory`, `loaded_file`, and `tied_to_directory` fields are updated.

# usage

This command would update fields starting with `/home/user/downloads` to start with `/var/downloads` instead. It looks in the `files` directory, and outputs changes to the `output` directory. Relative paths are accepted for `from` and `to`:

```
$ rtorrent-session-rectify --old /home/user/downloads --new /var/downloads/ --from files --to output
Found 90 session files in /home/sidd/files
Successfully updated 90 files.
```

# help

```
usage: rtorrent-session-rectify --old [string] --new [string] --from [path] --to [path]

    --old   Exact string to be replaced in old .rtorrent session files
            (i.e. /home/bt/).

    --new   New path to replace in .rtorrent session files
            (i.e. /home/bt/).

    --from  Directory containing .rtorrent session files.

    --to    Directory to output updated .rtorrent session files.

    --help  Show this help message.

    -v      Show verbose output.
```

# license

MIT
